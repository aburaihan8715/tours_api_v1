import express from 'express';

import * as userControllers from '../controllers/userControllers.js';

// USER ROUTES
const router = express.Router();
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
