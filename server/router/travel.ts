import { Router } from 'express';

// Module imports
import {
    createTravel,
    getTravels,
    getTravelById,
    updateTravel,
    deleteTravel,
    getTravelTravellers,
} from '../controller/travel.js';
import { auth } from '../middleware/auth.middleware.js';

const router: Router = Router();

// Protected routes configuration

/**
 * @openapi
 * /api/travel:
 *   post:
 *     summary: Create a new travel.
 *     tags: [Travels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - travel_code
 *               - name
 *               - seat_quantity
 *               - date
 *               - origin
 *               - destiny
 *             properties:
 *               travel_code:
 *                 type: string
 *               name:
 *                 type: string
 *               seat_quantity:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date-time
 *               origin:
 *                 type: string
 *               destiny:
 *                 type: string
 *     responses:
 *       201:
 *         description: Travel successfully created.
 *       400:
 *         description: Data missing or travel code already exists.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.post('/', auth, createTravel);

/**
 * @openapi
 * /api/travel:
 *   get:
 *     summary: Get all travels.
 *     tags: [Travels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Travels successfully fetched.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.get('/', auth, getTravels);

/**
 * @openapi
 * /api/travel/{id}:
 *   get:
 *     summary: Get a travel by ID.
 *     tags: [Travels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The travel ID
 *     responses:
 *       200:
 *         description: Travel successfully fetched.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Travel not found.
 *       500:
 *         description: Server error.
 */
router.get('/:id', auth, getTravelById);

/**
 * @openapi
 * /api/travel/{id}:
 *   put:
 *     summary: Update a travel by ID.
 *     tags: [Travels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The travel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               travel_code:
 *                 type: string
 *               name:
 *                 type: string
 *               seat_quantity:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date-time
 *               origin:
 *                 type: string
 *               destiny:
 *                 type: string
 *     responses:
 *       200:
 *         description: Travel updated successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.put('/:id', auth, updateTravel);

/**
 * @openapi
 * /api/travel/{id}:
 *   delete:
 *     summary: Delete a travel by ID.
 *     tags: [Travels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The travel ID
 *     responses:
 *       200:
 *         description: Travel deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.delete('/:id', auth, deleteTravel);

/**
 * @openapi
 * /api/travel/{id}/travellers:
 *   get:
 *     summary: Get all travellers registered for a specific travel.
 *     tags: [Travels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The travel ID
 *     responses:
 *       200:
 *         description: Travellers successfully fetched.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Travel not found.
 *       500:
 *         description: Server error.
 */
router.get('/:id/travellers', auth, getTravelTravellers);

export default router;
