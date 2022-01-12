import { Schema, model, Types, Document } from 'mongoose';
import { SocialLink, SocialLinkModel } from './social-link.model';

export interface User extends Document {
  username: string;
  displayName: string;
  email: string;
  password?: string;
  discordId?: string;
  googleId?: string;
  roles: Types.ObjectId[];
  projects: Types.ObjectId[];
  socialLinks: SocialLink[];
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
    socialLinks: [SocialLinkModel.schema]
  })
);
