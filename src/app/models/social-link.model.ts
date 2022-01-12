import { model, Schema } from 'mongoose';

export interface SocialLink extends Document {
  platform: string;
  username: string;
  link: string;
}

export const SocialLinkModel = model(
  'SocialLink',
  new Schema<SocialLink>({
    platform: { type: String, required: true },
    username: { type: String, required: true },
    link: { type: String, required: true }
  })
);
