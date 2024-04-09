import express from 'express';

import * as authControllers from '../controllers/authControllers.js';

// USER ROUTES
const router = express.Router();
router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);

export { router as authRouter };
