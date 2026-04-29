import { Router } from 'express';

// Module imports
import {
    createTravel,
    getTravels,
    getTravelById,
    updateTravel,
    deleteTravel,
} from '../controller/travel.js';
import { auth } from '../middleware/auth.middleware.js';

const router: Router = Router();

// Protected routes configuration
router.post('/', auth, createTravel);
router.get('/', auth, getTravels);
router.get('/:id', auth, getTravelById);
router.put('/:id', auth, updateTravel);
router.delete('/:id', auth, deleteTravel);

export default router;
