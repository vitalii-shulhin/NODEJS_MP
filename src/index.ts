import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';

import { usersRouter } from './routes/users.router';
import { groupRouter } from './routes/group.router';
import { authRouter } from './routes/auth.router';
import { errorHandler } from './middleware/error.middleware';
import { isJwtValid } from './common/jwt.check';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(isJwtValid);
app.use(errorHandler);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use('/api/users/', usersRouter);
app.use('/api/group/', groupRouter);
app.use('/login', authRouter);

export default app.listen(process.env.APP_PORT, () => {
  // tslint:disable-next-line: no-console
  console.log(`Listening on port ${process.env.APP_PORT}`);
});
