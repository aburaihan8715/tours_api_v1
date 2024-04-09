import express from 'express';

import * as tourControllers from '../controllers/tourControllers.js';
import * as verify from '../middlewares/verify.js';

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourControllers.aliasTours, tourControllers.getAllTours);

router.route('/tour-stats').get(tourControllers.getTourStats);

router.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlan);

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
