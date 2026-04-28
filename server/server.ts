import './config/env.js';
import express from 'express';
import cors from 'cors';

// Router imports
import userRouter from './router/user.js';

// Types import
import type { Application, Request, Response } from 'express';

// Module improts
import { log } from './utils/utils.js';
import { dbConnection } from './config/database.js';

let app: Application = express();

// App configuration
const PORT = 3001;
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes configuration
app.use('/api/user/', userRouter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Travels agency server is up an running!',
    });
});

// Start application
const startApplication = async (): Promise<void> => {
    await dbConnection();

    app.listen(3001, () => {
        log(`Travels agency server is running on port ${PORT}...`);
    });
};

startApplication();
