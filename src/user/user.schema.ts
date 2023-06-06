import { Document, Schema } from 'mongoose';

export type UserDocument = User & Document;

export class User {
  username: string;
  totalRepos: number;
  totalCommits: number;
}

export const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  totalRepos: { type: Number, default: 0 },
  totalCommits: { type: Number, default: 0 },
});
