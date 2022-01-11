import { Schema, model, Types, Document } from 'mongoose';

export interface User extends Document {
  username: string;
  email: string;
  password?: string;
  discordId?: string;
  googleId?: string;
  roles: Types.ObjectId[];
}

export const UserModel = model(
  'User',
  new Schema<User>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: String,
    discordId: String,
    googleId: String,
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Role'
      }
    ]
  })
);
