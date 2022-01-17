import { model, Schema, Types, Document } from 'mongoose';
import { UserModel, RoleModel } from '.';

export interface ProjectMember extends Types.Subdocument {
  user: Types.ObjectId;
  roles: Types.ObjectId[];

  hasRole: (roleName: string) => Promise<boolean>;
}

export const ProjectMemberSchema = new Schema<ProjectMember>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roles: [{
    type: Schema.Types.ObjectId,
    ref: 'Role'
  }]
});

ProjectMemberSchema.methods.hasRole = async function(roleName: string): Promise<boolean> {
  const foundRole = await RoleModel.findOne({ name: roleName });
  if (foundRole === null) {
    return false;
  }
  return (this as ProjectMember).roles.some(roleId => roleId.equals(foundRole._id));
};

export interface Project extends Document {
  title: string;
  description: string;
  creationDate: Date;
  members: ProjectMember[];
  url?: string;
  imageUrl?: string;
  completionDate?: Date;

  isMember: (userId: string, role?: string) => Promise<boolean>;
}

export const ProjectSchema = new Schema<Project>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creationDate: { type: Date, required: true, default: () => new Date(), immutable: true },
  members: [ProjectMemberSchema],
  url: String,
  imageUrl: String,
  completionDate: Date
});

// Updates projects on users
ProjectSchema.post('save', async function(project: Project) {
  if (project.isModified('members.users')) {
    const projectUsers = await UserModel.find({
      _id: { $in: project.members.map(member => member.user) }
    });

    for (const user of projectUsers) {
      // If the project member doesn't have this project, then we add it to their projects.
      if (!user.projects.some(projectId => projectId === project._id)) {
        user.projects.push(project._id);
        await user.save();
      }
    }
  }
});

ProjectSchema.methods.isMember = async function(userId: string, role: string = ''): Promise<boolean> {
  for (const member of (this as Project).members) {
    if (member.user.toString() === userId && (role === '' || await member.hasRole(role))) {
      return true;
    }
  }
  return false;
};

export const ProjectModel = model(
  'Project',
  ProjectSchema
);

// TODO: Implement API for editing projects and user profiles.
