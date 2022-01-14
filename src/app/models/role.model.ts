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

export const ROLES: Role[] = [
  { name: 'user' } as Role,
  { name: 'moderator' } as Role,
  { name: 'admin' } as Role
];
