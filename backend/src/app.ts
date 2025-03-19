import express from 'express';
import { port } from './config/config';
import authRoute from './v1/routes/authRoute';
import { getDBConnection } from './config/db';

// Create the express app
const app = express();

// App uses
app.use(express.json());

// Routes
app.use('/v1/auth', authRoute);

// Start the server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    const pool = await getDBConnection();
    if (pool) {
        await pool.end();
        console.log('MySQL connection pool closed.');
    }
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});
