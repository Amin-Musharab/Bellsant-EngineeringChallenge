export interface IUserSchema {
  username: string;
  password: string;
  refreshTokens?: string[];
  machineData: {
    machines: Record<string, any>;
    scores: Record<string, any>;
  };
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
