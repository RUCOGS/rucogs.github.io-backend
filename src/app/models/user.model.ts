import { Schema, model, Types, Document } from 'mongoose';
import { ProjectModel, RoleModel, RoleType, IDable } from '.';
import { SocialLink, SocialLinkSchema } from './social-link.model';

export interface User extends IDable {
  email: string;
  password?: string;
  discordId?: string;
  googleId?: string;
}

export type UserDoc = Document & PublicUser & User;

export interface PublicUser {
  username: string;
  displayName: string;
  roles: Types.ObjectId[];
  projects: Types.ObjectId[];
  socialLinks: SocialLink[];
}

export const UserSchema = new Schema<UserDoc>({
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
});

// Updates projects on users
UserSchema.post('save', async function(user: UserDoc) {
  if (user.isModified('projects')) {
    const projects = await ProjectModel.find({
      _id: { $in: user.projects }
    });

    for (const project of projects) {
      // If the project doesn't have this user, then we add this user
      // to that project with default permissions.
      if (!project.members.some(member => member.user === user._id)) {
        // See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11291#issuecomment-248140648
        // for why we have to cast to <any> here
        project.members.push(<any> {
          user: user._id
        });
        await project.save();
      }
    }
  }

  if (user.roles.length === 0) {
    const userRole = await RoleModel.findOne({ name: RoleType.User });
    user.roles.push(userRole._id);
  }
});

export const UserModel = model(
  'User',
  UserSchema
);
