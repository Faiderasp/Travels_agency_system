import { Router } from 'express';

// Module imports
import { registerUser, loginUser } from '../controller/user.js';
// import { auth } from '../middleware/auth.middleware';

const router: Router = Router();

// Non-protected routes configuration
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
