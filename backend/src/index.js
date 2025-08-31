import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { db } from "./lib/db.js";
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


//routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);





if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
    });
}

// Connect to database first, then start server
const startServer = async () => {
    try {
        // Test the database connection
        await db.query('SELECT 1');
        console.log("Connected to MySQL database");
        
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