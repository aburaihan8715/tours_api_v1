import express from 'express';

import * as tourControllers from '../controllers/tourControllers.js';

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourControllers.aliasTours, tourControllers.getAllTours);

router.route('/tour-stats').get(tourControllers.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(tourControllers.getMonthlyPlan);

router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(tourControllers.createATour);
router
  .route('/:id')
  .get(tourControllers.getATour)
  .patch(tourControllers.updateATour)
  .delete(tourControllers.deleteATour);

export { router as tourRouter };
