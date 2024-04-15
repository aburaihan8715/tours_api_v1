import express from 'express';

import * as userControllers from '../controllers/userControllers.js';
import * as verify from '../middlewares/verify.js';

// USER ROUTES
const router = express.Router();

router.patch(
  '/updateMe',
  verify.verifyAuthentication,
  userControllers.updateMe,
);
router.patch(
  '/deleteMe',
  verify.verifyAuthentication,
  userControllers.deleteMe,
);

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createAUser);
router
  .route('/:id')
  .get(userControllers.getAUser)
  .patch(userControllers.updateAUser)
  .delete(userControllers.deleteAUser);

export { router as userRouter };
