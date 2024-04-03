import express from 'express';

import * as tourControllers from '../controllers/tourControllers.js';

const router = express.Router();

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
