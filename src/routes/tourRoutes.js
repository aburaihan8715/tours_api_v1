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
router.get(
  '/monthly-plan/:year',
  verify.verifyAuthentication,
  verify.verifyAuthorization('admin', 'lead-guide', 'guide'),
  tourControllers.getMonthlyPlan,
);

// tours-within?distance=233,center=34.124693, -118.113807&unit=mi
// tours-within/233/center/34.124693, -118.113807/unit/mi
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourControllers.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourControllers.getDistances);

router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(
    verify.verifyAuthentication,
    verify.verifyAuthorization('admin', 'lead-guide'),
    tourControllers.createATour,
  );
router
  .route('/:id')
  .get(tourControllers.getATour)
  .patch(
    verify.verifyAuthentication,
    verify.verifyAuthorization('admin', 'lead-guide'),
    tourControllers.updateATour,
  )
  .delete(
    verify.verifyAuthentication,
    verify.verifyAuthorization('admin'),
    tourControllers.deleteATour,
  );

export { router as tourRouter };
