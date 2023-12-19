import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/User';
import { IJwtPayload } from '../types/user';
import { getEnvironmentVariable, sendErrorResponse } from '../utils';

const FORBIDDEN_MESSAGE = 'Forbidden';
const SERVER_ERROR_MESSAGE = 'Server Error';
const JWT_SIGNING_OPTIONS = {
  AccessToken: { expiresIn: '15m' },
  RefreshToken: { expiresIn: '7d' },
};

export const login = async (req: Request, res: Response) => {
  try {
    const accessTokenSecret = getEnvironmentVariable('ACCESS_TOKEN_SECRET');
    const refreshTokenSecret = getEnvironmentVariable('REFRESH_TOKEN_SECRET');

    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendErrorResponse(res, 401, 'Invalid credentials');
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      accessTokenSecret,
      JWT_SIGNING_OPTIONS.AccessToken
    );
    const refreshToken = jwt.sign(
      { userId: user.id },
      refreshTokenSecret,
      JWT_SIGNING_OPTIONS.RefreshToken
    );

    await User.findOneAndUpdate(
      { _id: user.id },
      { $push: { refreshTokens: refreshToken } }
    );

    res.status(200).send({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    return sendErrorResponse(res, 500, SERVER_ERROR_MESSAGE);
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username) return sendErrorResponse(res, 400, '"username" is required');
    if (!password) return sendErrorResponse(res, 400, '"password" is required');

    const user = await User.findOne({ username });
    if (user) {
      return sendErrorResponse(res, 400, 'User already exists');
    }

    await User.create({ username, password });

    res.status(201).send({ message: 'User created' });
  } catch (err) {
    console.error(err);
    sendErrorResponse(res, 500, SERVER_ERROR_MESSAGE);
  }
};

export const token = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendErrorResponse(res, 401, 'Unauthorized');

    const user = await User.findOne({ refreshTokens: { $in: [refreshToken] } });
    if (!user) return sendErrorResponse(res, 403, FORBIDDEN_MESSAGE);

    const refreshTokenSecret = getEnvironmentVariable('REFRESH_TOKEN_SECRET');
    const accessTokenSecret = getEnvironmentVariable('ACCESS_TOKEN_SECRET');

    jwt.verify(refreshToken, refreshTokenSecret, {}, (err, decoded) => {
      if (err) return sendErrorResponse(res, 403, FORBIDDEN_MESSAGE);

      decoded = decoded as IJwtPayload;

      const accessToken = jwt.sign(
        { userId: decoded?.userId },
        accessTokenSecret,
        JWT_SIGNING_OPTIONS.AccessToken
      );
      res.status(200).send({ accessToken });
    });
  } catch (err) {
    console.error(err);
    sendErrorResponse(res, 500, SERVER_ERROR_MESSAGE);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    await User.updateOne(
      { refreshTokens: refreshToken },
      { $pull: { refreshTokens: refreshToken } }
    );
    res.status(204).send({ message: 'Success' });
  } catch (err) {
    console.error(err);
    sendErrorResponse(res, 500, SERVER_ERROR_MESSAGE);
  }
};
