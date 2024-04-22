import express from 'express';

import * as reviewControllers from '../controllers/reviewControllers.js';
import * as verify from '../middlewares/verify.js';

// POST /tours/123/reviews
// GET /tours/123/reviews
// GET /tours/123/reviews/123

const router = express.Router({ mergeParams: true });

// Authenticated all routes after this middleware
// NOTE: This is important to understand
router.use(verify.verifyAuthentication);

router
  .route('/')
  .get(reviewControllers.getAllReviews)
  .post(
    verify.verifyAuthorization('user'),
    reviewControllers.setTourAndUserIds,
    reviewControllers.createAReview,
  );

router
  .route('/:id')
  .get(reviewControllers.getAReview)
  .patch(
    verify.verifyAuthorization('user', 'admin'),
    reviewControllers.updateAReview,
  )
  .delete(
    verify.verifyAuthorization('user', 'admin'),
    reviewControllers.deleteAReview,
  );

export { router as reviewRouter };
