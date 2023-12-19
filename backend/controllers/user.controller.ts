import { Request, Response } from 'express';

import User from '../models/User';
import { sendErrorResponse } from '../utils';

const SERVER_ERROR_MESSAGE = 'Server Error';

export const me = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ _id: req.user?.userId }).lean();

    res.status(200).send({ message: 'Successful', user });
  } catch (err) {
    console.error(err);
    sendErrorResponse(res, 500, SERVER_ERROR_MESSAGE);
  }
};
