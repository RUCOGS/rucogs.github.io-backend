import { model, Schema, Types } from 'mongoose';

export interface Project extends Document {
  title: string;
  description: string;
  creationDate: Date;
  members: Types.ObjectId[];
  url?: string;
  imageUrl?: string;
  completionDate?: Date;
}

export const ProjectModel = model(
  'SocialLink',
  new Schema<Project>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    creationDate: { type: Date, required: true },
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    url: String,
    imageUrl: String,
    completionDate: Date
  })
);

// TODO: Implement API for editing projects and user profiles.