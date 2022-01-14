import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

export { User, UserModel, getPublicUser } from './user.model';
export { Role, RoleModel, ROLES } from './role.model';
export { Project, ProjectModel } from './project.model';
export { SocialLink, SocialLinkSchema } from './social-link.model';

export { mongoose };
