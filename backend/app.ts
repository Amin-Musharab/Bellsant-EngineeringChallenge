import 'dotenv/config';
import express, { Request, Response } from 'express';

import authRouter from './routes/auth.route';
import dbConnection from './database/connection';
import { getMachineHealth } from './machineHealth';

const app = express();
const port = 3001;

// Connect to the database
dbConnection();

// Middleware to parse JSON request bodies
app.use(express.json());

// Routers
app.use(authRouter);

// Endpoint to get machine health score
app.post('/machine-health', (req: Request, res: Response) => {
  const result = getMachineHealth(req);
  if (result.error) {
    res.status(400).json(result);
  } else {
    res.json(result);
  }
});

app.listen(port, () => {
  console.log(`API is listening at http://localhost:${port}`);
});
