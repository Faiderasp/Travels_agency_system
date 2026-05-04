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
import { auth, checkAdmin } from '../middleware/auth.middleware.js';

const router: Router = Router();

// Non-protected routes configuration

/**
 * @openapi
 * /api/user/register:
 *   post:
 *     summary: Register a new user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully created.
 *       400:
 *         description: Data missing or username already exists.
 *       500:
 *         description: Server error.
 */
router.post('/register', registerUser);

/**
 * @openapi
 * /api/user/login:
 *   post:
 *     summary: Login a user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged successfully.
 *       400:
 *         description: Data missing.
 *       401:
 *         description: Unauthorized - Incorrect credentials.
 *       500:
 *         description: Server error.
 */
router.post('/login', loginUser);

// Protected routes configuration

/**
 * @openapi
 * /api/user:
 *   get:
 *     summary: Get all users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users successfully fetched.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - Invalid token.
 *       500:
 *         description: Server error.
 */
router.get('/', auth, selectUsers);

/**
 * @openapi
 * /api/user/create:
 *   post:
 *     summary: Create a new user (Protected).
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully created.
 *       400:
 *         description: Data missing or username already exists.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - Invalid token or insufficient permissions.
 *       500:
 *         description: Server error.
 */
router.post('/create', auth, checkAdmin, createUser);

/**
 * @openapi
 * /api/user/{id}:
 *   put:
 *     summary: Update a user by ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - Invalid token or insufficient permissions.
 *       500:
 *         description: Server error.
 */
router.put('/:id', auth, checkAdmin, updateUser);

/**
 * @openapi
 * /api/user/{id}:
 *   delete:
 *     summary: Delete a user by ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - Invalid token or insufficient permissions.
 *       500:
 *         description: Server error.
 */
router.delete('/:id', auth, checkAdmin, deleteUser);

export default router;
