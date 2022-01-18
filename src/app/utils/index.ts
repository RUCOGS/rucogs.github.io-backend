import { keys } from 'ts-transformer-keys';

export function toTypeInstance<T extends Object>(object: any): T {
  const convertedObj: any = {};
  for (const objectKey of keys<T>()) {
    convertedObj[objectKey] = object[objectKey];
  }
  return convertedObj as T;
}
