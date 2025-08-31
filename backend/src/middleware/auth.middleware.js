import jwt from "jsonwebtoken";
import { db } from "../lib/db.js";
import cookieParser from "cookie-parser";

export const protectRoute = async (req, res, next) => {    
    try {
        const token = req.cookies.jwt;
        
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        
        // Get counselor from database
        const [counselors] = await db.query("SELECT * FROM counselor WHERE counselorID = ?", [decoded.id]);
        
        if (counselors.length === 0) {
            return res.status(401).json({ message: "Unauthorized: Counselor not found" });
        }
        
        // Set data for the route handler
        req.counselorId = decoded.id;
        req.counselor = counselors[0];
        
        // Call next() ONLY ONCE at the end
        next();
        
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}