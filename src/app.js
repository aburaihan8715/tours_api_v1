import express from 'express';
import morgan from 'morgan';

import { tourRouter } from './routes/tourRoutes.js';
import { userRouter } from './routes/userRoutes.js';

export const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
