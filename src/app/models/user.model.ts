import { Schema, model, Types, Document } from 'mongoose';
import { SocialLink, SocialLinkSchema } from './social-link.model';

export interface User extends Document, PublicUser {
  email: string;
  password?: string;
  discordId?: string;
  googleId?: string;
}

export interface PublicUser extends Document {
  username: string;
  displayName: string;
  roles: Types.ObjectId[];
  projects: Types.ObjectId[];
  socialLinks: SocialLink[];
}

export function getPublicUser(user: User): PublicUser {
  return {
    _id: user._id,
    username: user.username,
    displayName: user.displayName,
    roles: user.roles,
    projects: user.projects,
    socialLinks: user.socialLinks
  } as PublicUser;
}

export const UserModel = model(
  'User',
  new Schema<User>({
    username: { type: String, required: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    password: String,
    discordId: String,
    googleId: String,
    roles: [{
      type: Schema.Types.ObjectId,
      ref: 'Role'
    }],
    projects: [{
      type: Schema.Types.ObjectId,
      ref: 'Project'
    }],
    socialLinks: [SocialLinkSchema]
  })
);
