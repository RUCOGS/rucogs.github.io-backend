import { ObjectId } from 'mongodb';
import { Schema, model, Document } from 'mongoose';

export interface Role extends Document {
  name: string;
  inherits: string[];
  permissions: string[];
}

export const RoleModel = model(
  'Role',
  new Schema<Role>({
    name: String,
    inherits: [String],
    permissions: [String]
  })
);

export async function getRoleId(roleName: string): Promise<ObjectId> {
  return (await getRole(roleName))._id;
}

export async function getRole(roleName: string): Promise<Role> {
  return await RoleModel.findOne({ name: roleName });
}

export const enum RoleType {
  ProjectMember = 'project_member',
  ProjectAdmin = 'project_member',
  Public = 'public',
  User = 'user',
  Admin = 'admin'
}

export const ROLES: Role[] = [
  {
    name: RoleType.Public
  } as Role,
  {
    name: RoleType.User,
    inherits: [RoleType.Public]
  } as Role,
  {
    name: RoleType.Admin,
    inherits: [RoleType.User]
  } as Role
];

export const PROJECT_ROLES: Role[] = [
  {
    name: RoleType.ProjectMember
  } as Role,
  {
    name: RoleType.ProjectAdmin,
    inherits: [RoleType.ProjectMember]
  } as Role
];
