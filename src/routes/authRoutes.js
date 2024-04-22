import express from 'express';

import * as authControllers from '../controllers/authControllers.js';
import * as verify from '../middlewares/verify.js';

// USER ROUTES
const router = express.Router();
router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);
router.post('/forgetPassword', authControllers.forgetPassword);
router.patch('/resetPassword/:token', authControllers.resetPassword);

router.patch(
  '/updateMyPassword',
  verify.verifyAuthentication,
  authControllers.updatePassword,
);

export { router as authRouter };
