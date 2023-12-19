import { IUserJwtPayload } from './types/user';

declare namespace Express {
  export interface Request {
    user?: IUserJwtPayload;
  }
}
