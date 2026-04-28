import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env')});

// Types import
import type { Application, Request, Response } from 'express';

// Module improts
import { log } from './utils/utils';
// import { pgConnection } from './config/database.ts';

let app: Application = express();

// App configuration
const PORT = 3001;
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Travels agency server is up an running!' });
});

// Start application
const startApplication = async (): Promise<void> => {
    // await pgConnection();

    app.listen(3001, 
        () => {log(`Travels agency server is running on port ${PORT}...`)}
    );
}

startApplication();
