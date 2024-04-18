import express from 'express';

import * as reviewControllers from '../controllers/reviewControllers.js';
import * as verify from '../middlewares/verify.js';

// POST /tours/123/reviews
// GET /tours/123/reviews
// GET /tours/123/reviews/123

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewControllers.getAllReviews)
  .post(
    verify.verifyAuthentication,
    verify.verifyAuthorization('user'),
    reviewControllers.setTourAndUserIds,
    reviewControllers.createAReview,
  );

router
  .route('/:id')
  .delete(reviewControllers.deleteAReview)
  .patch(reviewControllers.updateAReview)
  .get(reviewControllers.getAReview);

export { router as reviewRouter };
