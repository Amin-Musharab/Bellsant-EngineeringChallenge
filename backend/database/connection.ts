import mongoose from 'mongoose';

import { getEnvironmentVariable } from '../utils';

export default async () => {
  try {
    const mongoUri = getEnvironmentVariable('MONGO_URI');

    await mongoose.connect(mongoUri);

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(
      'MongoDB connection error:',
      err instanceof Error ? err.message : err
    );

    process.exit(1);
  }
};
