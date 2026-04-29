import { Router } from 'express';

// Module imports
import {
    createTraveller,
    getTravellers,
    getTravellerById,
    updateTraveller,
    deleteTraveller,
    getTravellerTravels,
} from '../controller/traveller.js';
import { auth } from '../middleware/auth.middleware';

const router: Router = Router();

// Protected routes configuration
router.post('/', auth, createTraveller);
router.get('/', auth, getTravellers);
router.get('/:id', auth, getTravellerById);
router.put('/:id', auth, updateTraveller);
router.delete('/:id', auth, deleteTraveller);
router.get('/:id/travels', auth, getTravellerTravels);

export default router;
