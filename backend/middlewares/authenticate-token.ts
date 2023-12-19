import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { getEnvironmentVariable, sendErrorResponse } from '../utils';
import type { IUserJwtPayload } from '../types/user';

export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return sendErrorResponse(res, 401, 'Unauthorized');

  const accessTokenSecret = getEnvironmentVariable('ACCESS_TOKEN_SECRET');

  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (err) return sendErrorResponse(res, 403, 'Forbidden');

    decoded = decoded as IUserJwtPayload;
    req.user = { userId: decoded.userId };

    next();
  });
};
