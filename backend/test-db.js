import dotenv from 'dotenv';
import mysql from 'mysql2';

// Load environment variables
dotenv.config();

console.log('Environment variables loaded:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

// Create connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

console.log('Attempting to connect...');

connection.connect((err) => {
    if (err) {
        console.error('Connection error:', err);
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        return;
    }
    
    console.log('Successfully connected to MySQL!');
    connection.end();
});

