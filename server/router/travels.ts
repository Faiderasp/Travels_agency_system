import { Router } from 'express';

// Module imports
import {
    createTravels,
    getTravelRegistrations,
    deleteTravels,
} from '../controller/travels.js';
import { auth } from '../middleware/auth.middleware.js';

const router: Router = Router();

// Protected routes configuration
router.post('/', auth, createTravels);
router.get('/:travel_id', auth, getTravelRegistrations);
router.delete('/:id', auth, deleteTravels);

export default router;
