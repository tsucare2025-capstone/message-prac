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
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        connectTimeout: 10000, // 10 seconds
        acquireTimeout: 10000,
        timeout: 10000,
    }).promise();
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
        await db.query('SELECT 1');
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