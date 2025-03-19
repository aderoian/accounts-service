import mysql, { Pool } from 'mysql2/promise';
import { database } from './config';

let pool: Pool | null = null;

// Create the connection pool (Singleton)
export const getDBConnection = async (): Promise<Pool> => {
    if (!pool) {
        console.log('Initializing MySQL connection pool...');
        pool = mysql.createPool({
            host: database.host,
            user: database.user,
            password: database.password,
            database: database.name,
            waitForConnections: true,
            connectionLimit: database.connection_limit,
            queueLimit: 10 //,
        });
    }
    return pool;
};
