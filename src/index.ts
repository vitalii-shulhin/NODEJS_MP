import express from 'express';
import { usersRouter } from './routes/users.router';
import { groupRouter } from './routes/group.router';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use('/api/users/', usersRouter);
app.use('/api/group/', groupRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  // tslint:disable-next-line: no-console
  console.log(`Listening on port ${PORT}`);
});
