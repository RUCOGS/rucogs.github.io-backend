import { Schema, Types } from 'mongoose';

export interface SocialLink extends Types.Subdocument {
  platform: string;
  username: string;
  link: string;
}

export const SocialLinkSchema = new Schema<SocialLink>({
  platform: { type: String, required: true },
  username: { type: String, required: true },
  link: { type: String, required: true }
});
