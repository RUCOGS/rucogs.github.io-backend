import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

export { User, UserModel } from './user.model';
export { Role, RoleModel } from './role.model';

export const ROLES = ['user', 'admin', 'moderator'];
export { mongoose };
