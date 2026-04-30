import { Sequelize } from 'sequelize';

// Modules import
import { log, sleep } from '../utils/utils.js';

// Creating the MySQL sequelize object
log(`DB Config: Host=${process.env.MYSQL_HOST}, Database=${process.env.MYSQL_DATABASE}, User=${process.env.MYSQL_USER}, Port=${process.env.DB_PORT || 3306}`);
export const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE || '',
    process.env.MYSQL_USER || '',
    process.env.MYSQL_PASSWORD || '',
    {
        host: process.env.MYSQL_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        dialect: 'mysql',
        logging: false,
    }
);


// Function to connect to MySQL
export const dbConnection = async (): Promise<void> => {
    log('Connecting to MySQL...');
    let connected = false;
    while (!connected) {
        try {
            await sequelize.authenticate();
            log('MySQL successfully connected.');
            connected = true;
        } catch (error) {
            // Loops till the database is successfully connected
            log(
                `MySQL got an error while trying to connect: ${error} - Retrying in 5 seconds...`
            );
            await sleep(5000);
        }
    }
};
