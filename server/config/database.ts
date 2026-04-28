import { Sequelize } from 'sequelize';

// Modules import
import { log, sleep } from '../utils/utils';

// Preparing the connection URLs for the database
const pgUri = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}`;

// Creating the Postgres sequelize object
export const pgSequelize = new Sequelize(pgUri, { logging: false });

// Function to connect to Postgres
export const pgConnection = async (): Promise<void> => {
    log('Connecting to Postgres...');
    let connected = false;
    while (!connected) {
        try {
            await pgSequelize.authenticate();
            log('Postgres successfully connected.');
            connected = true;
        } catch (error) {
            // Loops till the database is successfully connected
            log(`Postgres got an error while trying to connect: ${error} - Retrying in 5 seconds...`);
            await sleep(5000);
        }
    }
}