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
import { auth } from '../middleware/auth.middleware.js';

const router: Router = Router();

// Protected routes configuration

/**
 * @openapi
 * /api/traveller:
 *   post:
 *     summary: Create a new traveller.
 *     tags: [Travellers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dni
 *               - name
 *               - address
 *               - phone
 *             properties:
 *               dni:
 *                 type: string
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Traveller successfully created.
 *       400:
 *         description: Data missing or DNI already exists.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.post('/', auth, createTraveller);

/**
 * @openapi
 * /api/traveller:
 *   get:
 *     summary: Get all travellers.
 *     tags: [Travellers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Travellers successfully fetched.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.get('/', auth, getTravellers);

/**
 * @openapi
 * /api/traveller/{id}:
 *   get:
 *     summary: Get a traveller by ID.
 *     tags: [Travellers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The traveller ID
 *     responses:
 *       200:
 *         description: Traveller successfully fetched.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Traveller not found.
 *       500:
 *         description: Server error.
 */
router.get('/:id', auth, getTravellerById);

/**
 * @openapi
 * /api/traveller/{id}:
 *   put:
 *     summary: Update a traveller by ID.
 *     tags: [Travellers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The traveller ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Traveller updated successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.put('/:id', auth, updateTraveller);

/**
 * @openapi
 * /api/traveller/{id}:
 *   delete:
 *     summary: Delete a traveller by ID.
 *     tags: [Travellers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The traveller ID
 *     responses:
 *       200:
 *         description: Traveller deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.delete('/:id', auth, deleteTraveller);

/**
 * @openapi
 * /api/traveller/{id}/travels:
 *   get:
 *     summary: Get all travels for a specific traveller.
 *     tags: [Travellers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The traveller ID
 *     responses:
 *       200:
 *         description: Travels successfully fetched.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Traveller not found.
 *       500:
 *         description: Server error.
 */
router.get('/:id/travels', auth, getTravellerTravels);

export default router;
