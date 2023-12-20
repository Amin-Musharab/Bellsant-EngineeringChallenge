import express from 'express';

import authenticateToken from '../middlewares/authenticate-token';
import * as userController from '../controllers/user.controller';

const router = express.Router();

router.get('/me', authenticateToken, userController.me);
router.post(
  '/me/persist-machine-data',
  authenticateToken,
  userController.persistMachineData
);
router.delete(
  '/me/machine-data',
  authenticateToken,
  userController.removeMachineData
);

export default router;
