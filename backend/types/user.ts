export interface IUserSchema {
  username: string;
  password: string;
  refreshTokens?: string[];
}

export type IUser = Omit<IUserSchema, 'password'>;

export interface IJwtPayload {
  userId: string;
}
