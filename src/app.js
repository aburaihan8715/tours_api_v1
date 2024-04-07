import express from 'express';
import morgan from 'morgan';
import path from 'path';

import { tourRouter } from './routes/tourRoutes.js';
import { userRouter } from './routes/userRoutes.js';
import { AppError } from './utils/appError.js';
import { globalErrorController } from './controllers/errorControllers.js';

const __dirname = path.resolve();
export const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// UNHANDLED ROUTE HANDLER
app.all('*', (req, res, next) => {
  next(
    new AppError(
      404,
      `Can't find ${req.originalUrl} on this server!`,
    ),
  );
});

// GLOBAL ERROR HANDLER ROUTE
app.use(globalErrorController);
