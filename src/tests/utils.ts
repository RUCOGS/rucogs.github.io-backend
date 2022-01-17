// Converts mongodb model into a model
// that can be send over the internet.
//
// This is also handy for comparing
// local models against ones fetched
// from a database, because those
// models are stored in a web-safe

import random from 'random';

// format.
export function getWebModel(object: any): any {
  return JSON.parse(JSON.stringify(object));
}

export const RNG_SEED = 'seed';
export const rng = random.clone(RNG_SEED);

export function randSubarray<T>(arr: T[], size: number): T[] {
  const shuffled = arr.slice(0);
  let i = arr.length;
  const min = i - size;
  let temp: T;
  let index: number;
  while (i-- > min) {
    index = Math.floor((i + 1) * rng.float());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

export function randElement<T>(arr: T[]): T {
  return arr[rng.int(0, arr.length - 1)];
}
