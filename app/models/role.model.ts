import { Schema, model, Document } from 'mongoose';

export interface Role extends Document {
  name: string;
}

export const RoleModel = model(
  'Role',
  new Schema<Role>({
    name: String
  })
);
