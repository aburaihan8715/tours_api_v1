import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import expressMongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

import { globalErrorController } from './controllers/errorControllers.js';
import { AppError } from './utils/appError.js';
import { tourRouter } from './routes/tourRoutes.js';
import { userRouter } from './routes/userRoutes.js';
import { authRouter } from './routes/authRoutes.js';

const __dirname = path.resolve();
export const app = express();
const limiter = rateLimit({
  windowMs: 1000 * 60 * 60, // 1 hour
  limit: 100,
  message: 'Too many requests from this IP, please try again in an hour!',
});

// 01) GLOBAL MIDDLEWARES
// set security http headers
app.use(helmet());

// Body parser, reading data from body into req.body));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(expressMongoSanitize());

// Display or serving static files
app.use(express.static(`${__dirname}/public`));

// Development logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
app.use('/api', limiter);

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// 02) TEST MIDDLEWARES
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 03) ROUTES MIDDLEWARES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

// UNHANDLED ROUTE HANDLER
app.all('*', (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

// GLOBAL ERROR HANDLER ROUTE
app.use(globalErrorController);
