import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

import type { IUserSchema } from '../types/user';

const userSchema = new mongoose.Schema<IUserSchema>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  refreshTokens: { type: [String], required: false },
  machineData: { machines: Schema.Types.Mixed },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
