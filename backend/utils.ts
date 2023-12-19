import { Response } from 'express';

export const getEnvironmentVariable = (
  name: string,
  type = 'string'
): string => {
  const value = process.env[name];
  if (!(value && typeof value === type)) {
    throw new Error(`Missing required environment variable "${name}"`);
  }
  return value;
};

export const sendErrorResponse = (
  response: Response,
  status: number,
  message: string
) => {
  response.status(status).json({ message });
};
