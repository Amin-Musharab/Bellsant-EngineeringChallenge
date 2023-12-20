import mongoose, { Schema, Types } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    machineData: { machines: Schema.Types.Mixed, scores: Schema.Types.Mixed },
    user: { type: Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const MachineDataHistory = mongoose.model('MachineDataHistory', userSchema);

export default MachineDataHistory;
