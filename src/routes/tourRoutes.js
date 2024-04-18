import express from 'express';

import * as tourControllers from '../controllers/tourControllers.js';
import * as verify from '../middlewares/verify.js';
import { reviewRouter } from './reviewRoutes.js';

const router = express.Router();

// POST /tours/123/reviews
// GET /tours/123/reviews
// GET /tours/123/reviews/123

router.use('/:tourId/reviews', reviewRouter);

router.get(
  '/top-5-cheap',
  tourControllers.aliasTours,
  tourControllers.getAllTours,
);
router.get('/tour-stats', tourControllers.getTourStats);
router.get('/monthly-plan/:year', tourControllers.getMonthlyPlan);

router
  .route('/')
  .get(verify.verifyAuthentication, tourControllers.getAllTours)
  .post(tourControllers.createATour);
router
  .route('/:id')
  .get(tourControllers.getATour)
  .patch(tourControllers.updateATour)
  .delete(
    verify.verifyAuthentication,
    verify.verifyAuthorization('admin'),
    tourControllers.deleteATour,
  );

export { router as tourRouter };
