import { Schema, model, ObjectId, Document } from 'mongoose';

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  roles: ObjectId[];
}

export const UserModel = model(
  'User',
  new Schema<User>({
    username: String,
    email: String,
    password: String,
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Role'
      }
    ]
  })
);
