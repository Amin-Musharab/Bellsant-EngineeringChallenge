import express from 'express';

import authenticateToken from '../middlewares/authenticate-token';
import * as userController from '../controllers/user.controller';

const router = express.Router();

router.get('/me', authenticateToken, userController.me);

export default router;
