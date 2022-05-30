import { HttpError } from "@src/utils/utils";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

export const UPLOAD_DIRECTORY = "src/uploads";
export const SELF_HOSTED_PREFIX = "cdn://";

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
  return await fs.promises.unlink(UPLOAD_DIRECTORY + "/" + relativeFilePath);
}

// dest is relative to UPLOAD_DIRECTORY
// Downloads a file and returns the 
export async function downloadToCdn(url: string, filename: string = path.basename(url), dest: string = ""): Promise<string> {
  let httpModule: typeof http | typeof https = http;
  if (url.startsWith("https://")) {
    httpModule = https;
  }
  const uniqueName = uniqueFileName(filename);
  const relativePath = path.join(UPLOAD_DIRECTORY, dest, uniqueName);
  return new Promise<string>((resolve, reject) => {
    var file = fs.createWriteStream(relativePath);
    var request = httpModule.get(url, function(response) {
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

export function uniqueFileName(filename: string) {
  return Date.now() + path.extname(filename);
}