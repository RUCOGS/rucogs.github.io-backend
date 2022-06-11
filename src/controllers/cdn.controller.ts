import { HttpError } from "@src/utils";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { ReadStream } from "fs-capacitor";
import { finished } from 'stream/promises';
import { FileUpload } from "graphql-upload";
import { Transform, TransformCallback } from 'stream';

export const UPLOAD_DIRECTORY = "src/uploads";
export const SELF_HOSTED_PREFIX = "cdn://";

export function tryDeleteFileIfSelfHosted(filePath: string | null | undefined) {
  if (!filePath)
    return;
  if (isSelfHostedFile(filePath))
    return deleteSelfHostedFile(filePath);
}

// We use `self://` prefix to denote a self-hosted file
export function isSelfHostedFile(selfHostedFilePath: string) {
  return selfHostedFilePath.startsWith(SELF_HOSTED_PREFIX) && selfHostedFilePath.length > SELF_HOSTED_PREFIX.length;
}

export function selfHostedToRelativeFilePath(selfHostedFilePath: string) {
  if (!isSelfHostedFile(selfHostedFilePath))
    throw new HttpError(400, "Cannot get self hosted filepath from filepath that isn't self hosted.");
  // Trim `self://` from the start
  return selfHostedFilePath.substring(SELF_HOSTED_PREFIX.length);
}

export function relativeToSelfHostedFilePath(relativeFilePath: string) {
  let relativePath = path.relative(UPLOAD_DIRECTORY, relativeFilePath);
  // Trim the dot and slash at the start
  if (relativePath.startsWith("./"))
    relativePath = relativePath.substring(2);
  return SELF_HOSTED_PREFIX + relativePath;
}

export async function deleteSelfHostedFile(selfHostedFilePath: string) {
  if (!isSelfHostedFile(selfHostedFilePath))
    throw new HttpError(400, "Expected a self hosted file path.");
  const relativeFilePath = selfHostedToRelativeFilePath(selfHostedFilePath);
  const path = UPLOAD_DIRECTORY + "/" + relativeFilePath;
  try {
    await fs.promises.unlink(path);
  } catch (error) {
    
  }
}

// dest is relative to UPLOAD_DIRECTORY
// Downloads a file and returns the 
export async function downloadToCdn(options: {
  url: string
  filename?: string
  dest?: string
}): Promise<string> {
  if (options.filename === undefined)
    options.filename = path.basename(options.url);
  if (options.dest === undefined)
    options.dest = "";
    
  let httpModule: typeof http | typeof https = http;
  if (options.url.startsWith("https://")) {
    httpModule = https;
  }

  const uniqueName = uniqueFileName(options.filename);
  const relativePath = path.join(UPLOAD_DIRECTORY, options.dest, uniqueName);

  return new Promise<string>((resolve, reject) => {
    var file = fs.createWriteStream(relativePath);
    var request = httpModule.get(options.url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close();  // close() is async, call cb after close completes.
        const selfHostedPath = relativeToSelfHostedFilePath(relativePath);
        resolve(selfHostedPath);
      });
    }).on('error', function(request_err) { // Handle errors
      fs.unlink(relativePath, (err) => {
        // Delete the file async.
        reject(request_err);
      });
    });
  });
}

export class StreamSizeLimiter extends Transform {
  constructor(public sizeLimitBytes: number) {
    super();
  }

  length: number = 0;

  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
      this.length += chunk.length;

      if (this.length > this.sizeLimitBytes) {
        this.destroy(new Error(`Max stream size of ${this.sizeLimitBytes} exceeded.`));
        return;
      }

      this.push(chunk);
      callback();
  }
}

export enum DataSize {
  GB = 1_000_000_000,
  MB = 1_000_000,
  KB = 1_000,
}

export async function readStreamToCdn(options: {
  readStream: ReadStream
  filename: string
  maxSizeBytes?: number
  dest?: string
}): Promise<string> {
  if (options.dest == undefined)
    options.dest = "";
  
  const uniqueName = uniqueFileName(options.filename);
  const relativePath = path.join(UPLOAD_DIRECTORY, options.dest, uniqueName);
  const destination = fs.createWriteStream(relativePath);
  
  if (options.maxSizeBytes) {
    const sizeLimiter = new StreamSizeLimiter(options.maxSizeBytes);
    sizeLimiter.on("error", error => {
      options.readStream.destroy(error);
      destination.destroy(error);
    });
    // Connect streams.
    options.readStream
      .pipe(sizeLimiter)
      .pipe(destination);
  } else {
    options.readStream
      .pipe(destination);
  }
    
  await finished(destination);
  destination.close();

  const selfHostedPath = relativeToSelfHostedFilePath(relativePath);
  return selfHostedPath;
}

export async function fileUploadToCdn(options: {
  fileUpload: FileUpload,
  maxSizeBytes?: number, 
  dest?: string
}): Promise<string> {
  if (options.dest === undefined)
    options.dest = "";
  
  const readStream = options.fileUpload.createReadStream();
  const selfHostedPath = await readStreamToCdn({
    readStream, 
    maxSizeBytes: options.maxSizeBytes,
    filename: options.fileUpload.filename, 
    dest: options.dest
  });
  return selfHostedPath;
}

export async function fileUploadPromiseToCdn(options: {
  fileUploadPromise: Promise<FileUpload>
  maxSizeBytes?: number
  dest?: string
}): Promise<string> {
  const fileUpload = await options.fileUploadPromise;
  const readStream = fileUpload.createReadStream();
  const selfHostedPath = await readStreamToCdn({
    readStream, 
    maxSizeBytes: options.maxSizeBytes,
    filename: fileUpload.filename, 
    dest: options.dest
  });
  return selfHostedPath;
}

export function uniqueFileName(filename: string) {
  return Date.now() + path.extname(filename);
}