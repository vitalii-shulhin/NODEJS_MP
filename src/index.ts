import express from 'express';
import morgan from 'morgan';

import { usersRouter } from './routes/users.router';
import { groupRouter } from './routes/group.router';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(errorHandler);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use('/api/users/', usersRouter);
app.use('/api/group/', groupRouter);

app.listen(PORT, () => {
  // tslint:disable-next-line: no-console
  console.log(`Listening on port ${PORT}`);
});
