import 'dotenv/config';
import express, { Request, Response } from 'express';

import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import dbConnection from './database/connection';
import { getMachineHealth } from './machineHealth';
import MachineDataHistory from './models/MachineDataHistory';
import authenticateToken from './middlewares/authenticate-token';

const app = express();
const port = 3001;

// Connect to the database
dbConnection();

// Middleware to parse JSON request bodies
app.use(express.json());

// Routers
app.use(authRouter);
app.use(userRouter);

// Endpoint to get machine health score
app.post(
  '/machine-health',
  authenticateToken,
  (req: Request, res: Response) => {
    const result = getMachineHealth(req);
    if (result.error) {
      res.status(400).json(result);
    } else {
      MachineDataHistory.create({
        machineData: {
          machines: req.body.machines,
          scores: result,
        },
        user: req.user?.userId,
      });
      res.json(result);
    }
  }
);

app.listen(port, () => {
  console.log(`API is listening at http://localhost:${port}`);
});
