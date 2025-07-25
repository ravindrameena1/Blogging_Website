import {Router} from 'express';
import { registerUser ,loginUser,logoutUser, refreshAccessToken } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Register a new user
router.route('/register').post(registerUser);
// Login a user
router.route('/login').post(loginUser);

// protected routes
router.route('/logout').post(verifyJWT,logoutUser);
router.route('/refresh-token').post(refreshAccessToken);

export default router;