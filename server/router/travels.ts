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

/**
 * @openapi
 * /api/travels:
 *   post:
 *     summary: Register a traveller for a travel.
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - traveller_id
 *               - travel_id
 *             properties:
 *               traveller_id:
 *                 type: integer
 *               travel_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Traveller successfully registered for the travel.
 *       400:
 *         description: Data missing, traveller already registered, or no seats available.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.post('/', auth, createTravels);

/**
 * @openapi
 * /api/travels/{travel_id}:
 *   get:
 *     summary: Get all registrations for a specific travel.
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: travel_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The travel ID
 *     responses:
 *       200:
 *         description: Registrations successfully fetched.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.get('/:travel_id', auth, getTravelRegistrations);

/**
 * @openapi
 * /api/travels/{id}:
 *   delete:
 *     summary: Delete a registration (unregister a traveller).
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The registration ID (travels_id)
 *     responses:
 *       200:
 *         description: Registration successfully deleted.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.delete('/:id', auth, deleteTravels);

export default router;
