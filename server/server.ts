import './config/env.js';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

// Router imports
import userRouter from './router/user.js';
import travellerRouter from './router/traveller.js';
import travelRouter from './router/travel.js';
import travelsRouter from './router/travels.js';

// Types import
import type { Application, Request, Response } from 'express';

// Module improts
import { log } from './utils/utils.js';
import { dbConnection } from './config/database.js';
import { swaggerSpec } from './docs/swagger.js';

// Setup database associations
import './models/associations.js';

const app: Application = express();

// App configuration
const PORT = 3001;
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes configuration
app.use('/api/user', userRouter);
app.use('/api/traveller', travellerRouter);
app.use('/api/travel', travelRouter);
app.use('/api/travels', travelsRouter);


// Health check
/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Health check
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Travels agency server is up and running
 */
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Travels agency server is up an running!',
    });
});

// Documentation endpoint
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start application
const startApplication = async (): Promise<void> => {
    await dbConnection();

    app.listen(3001, '0.0.0.0', () => {
        log(`Travels agency server is running on port ${PORT}...`);
        log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

};

log('Starting application...');
startApplication().catch(err => {
    log(`FATAL ERROR during startup: ${err}`);
});

