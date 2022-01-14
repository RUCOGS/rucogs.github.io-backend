import { Types } from 'mongoose';

// Converts mongodb model into a model
// that can be send over the internet.
//
// This is also handy for comparing
// local models against ones fetched
// from a database, because those
// models are stored in a web-safe
// format.
export function convertToWebModel(object: any): any {
  return JSON.parse(JSON.stringify(object));
}
