import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

// middlewares imports
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import errorHandler from './middlewares/errorHandler';

// routers
import userRouter from './users/user.routes';
import loginRouter from './auth/login';

const PORT = process.env.PORT as string;

const app = express();

// middlewares
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res, next) => {
  res.json('Jeff Segovia says Hi!');
});

app.use('/users', userRouter);
app.use('/login', loginRouter);

// error handler
app.use(errorHandler);

export default app;
