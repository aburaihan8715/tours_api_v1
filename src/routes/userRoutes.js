import express from 'express';

import * as userControllers from '../controllers/userControllers.js';
import * as verify from '../middlewares/verify.js';

const router = express.Router();

// Authenticated all routes after this middleware
// NOTE: This is important to understand
router.use(verify.verifyAuthentication);

router.get('/me', userControllers.getMe, userControllers.getAUser);
router.patch('/updateMe', userControllers.updateMe);
// NOTE: here delete means make user inactive not delete actually, so use patch
router.patch('/deleteMe', userControllers.deleteMe);

// Authorized all routes after this middleware
// NOTE: This is important to understand
router.use(verify.verifyAuthorization('admin'));

router.get('/', userControllers.getAllUsers);
router
  .route('/:id')
  .get(userControllers.getAUser)
  .patch(userControllers.updateAUser)
  .delete(userControllers.deleteAUser);

export { router as userRouter };
