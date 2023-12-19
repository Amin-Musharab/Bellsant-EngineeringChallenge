export interface IUserSchema {
  username: string;
  password: string;
  refreshTokens?: string[];
}

export type IUser = Omit<IUserSchema, 'password'>;

export interface IUserJwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserJwtPayload;
    }
  }
}
