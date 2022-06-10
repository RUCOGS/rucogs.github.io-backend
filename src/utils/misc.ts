import equal from 'deep-equal';

export type Nullable<T> = { [K in keyof T]: T[K] | null };