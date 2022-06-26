import equal from 'deep-equal';

export function hasDuplicates<T>(arr: T[], equalityFn: (one: T, two: T) => boolean) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (equalityFn(arr[i], arr[j])) {
        return true;
      }
    }
  }
  return false;
}

export function isDeepEquals(o1: any, o2: any) {
  return equal(o1, o2);
}

export function hasDuplicatesDeepEquals<T>(arr: T[]) {
  return hasDuplicates(arr, isDeepEquals);
}

// Compares the properties of one object against the
// properties of another object.
export function isShallowEquals(o1: any, o2: any) {
  for (const p in o1) {
    if (o1.hasOwnProperty(p)) {
      if (o1[p] !== o2[p]) {
        return false;
      }
    }
  }
  for (const p in o2) {
    if (o2.hasOwnProperty(p)) {
      if (o1[p] !== o2[p]) {
        return false;
      }
    }
  }
  return true;
}

export class HttpError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
  }
}
