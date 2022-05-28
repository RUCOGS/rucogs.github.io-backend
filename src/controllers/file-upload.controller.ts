import fs from "fs";
import path from "path";
import sanitize from "sanitize-filename";

export const UPLOAD_DIRECTORY = "src/uploads";
export const SELF_HOSTED_PREFIX = "cdn://";

// We use `self://` prefix to denote a self-hosted file
export function isSelfHostedFile(selfHostedFilePath: string) {
  return selfHostedFilePath.startsWith(SELF_HOSTED_PREFIX) && selfHostedFilePath.length > SELF_HOSTED_PREFIX.length;
}

export function selfHostedToRelativeFilePath(selfHostedFilePath: string) {
  if (!isSelfHostedFile(selfHostedFilePath))
    throw new Error("Cannot get self hosted filepath from filepath that isn't self hosted.");
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
    throw new Error("Expected a self hosted file path.");
  const relativeFilePath = selfHostedToRelativeFilePath(selfHostedFilePath);
  return await fs.promises.unlink(UPLOAD_DIRECTORY + "/" + relativeFilePath);
}