import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import mysql from "mysql2";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

import path from "path";


dotenv.config();

// Handle unhandled promise rejections and errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Don't exit, let the app continue running
});

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();


// Create a middleware to provide fresh database connections
app.use((req, res, next) => {
    req.db = createDbConnection();
    next();
});

// Cleanup middleware to close database connections
app.use((req, res, next) => {
    res.on('finish', async () => {
        try {
            await req.db.end();
        } catch (error) {
            console.error('Error closing database connection:', error);
        }
    });
    next();
});

//routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);





if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
    });
}

// Create a fresh database connection
const createDbConnection = () => {
    const connectionConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        connectTimeout: 60000, // 60 seconds
        ssl: false, // Disable SSL for Railway proxy
        multipleStatements: false,
    };
    
    console.log('Creating connection with config:', {
        host: connectionConfig.host,
        user: connectionConfig.user,
        database: connectionConfig.database,
        port: connectionConfig.port
    });
    
    return mysql.createConnection(connectionConfig).promise();
};

// Connect to database first, then start server
const startServer = async () => {
    try {
        // Debug: Log connection details (without password)
        console.log('Attempting to connect to database:', {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });
        
        // Create a fresh connection and test it
        const db = createDbConnection();
        
        // Add error event handler to prevent unhandled errors
        db.connection.on('error', (err) => {
            console.error('Database connection error:', err);
        });
        
        // Set a timeout for the connection attempt
        const connectionPromise = db.query('SELECT 1');
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Connection timeout')), 60000);
        });
        
        await Promise.race([connectionPromise, timeoutPromise]);
        console.log("Connected to MySQL database");
        
        // Close the test connection
        await db.end();
        
        // Start server only after successful database connection
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Database connection failed:', error);
        console.log('Retrying database connection in 5 seconds...');
        
        // Retry connection after 5 seconds instead of crashing
        setTimeout(startServer, 5000);
    }
};

startServer();