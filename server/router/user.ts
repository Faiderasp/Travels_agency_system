import { Router } from 'express';

// Module imports
import {
    registerUser,
    loginUser,
    selectUsers,
    createUser,
    deleteUser,
    updateUser,
} from '../controller/user.js';
import { auth } from '../middleware/auth.middleware';

const router: Router = Router();

// Non-protected routes configuration
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes configuration
router.get('/', auth, selectUsers);
router.post('/create', auth, createUser);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

export default router;
