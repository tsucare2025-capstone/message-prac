import { db } from "../lib/db.js";
import { getReceiverSocketId, io} from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser = req.counselor;
        //console.log('Getting users for sidebar, logged in user:', loggedInUser);
        
        if (!loggedInUser || !loggedInUser.counselorID) {
            return res.status(401).json({ message: "User not authenticated properly" });
        }
        
        // Get all counselors except the logged-in one
        const query = 'SELECT counselorID as _id, name, email FROM counselor WHERE counselorID != ?';
       // console.log('Executing query:', query, 'with params:', [loggedInUser.counselorID]);
        
        const [results] = await db.query(query, [loggedInUser.counselorID]);
        //console.log('Users found:', results);
        res.status(200).json(results);
        
    } catch(error) {
        console.error('getUsersForSideBar error:', error);
        res.status(500).json({message: error.message});
    }
}

export const getMessages = async (req, res) => {
    try {
        const { userId: userToChatWithId } = req.params;
        const loggedInUserId = req.counselor.counselorID;

        const [messages] = await db.query("SELECT * FROM messages WHERE (counselorID = ? AND studentID = ?) OR (counselorID = ? AND studentID = ?) ORDER BY timestamp", [loggedInUserId, userToChatWithId, userToChatWithId, loggedInUserId]);
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;  // Frontend sends { message: "text" }
        const { userId: userToChatWithId } = req.params;
        const senderId = req.counselor.counselorID;

        // Insert the message into database using correct column names
        const query = 'INSERT INTO messages (counselorID, studentID, text, timestamp) VALUES (?, ?, ?, NOW())';
        const [result] = await db.query(query, [senderId, userToChatWithId, message]);

        // Create the response object
        const newMessage = {
            messageID: result.insertId,
            counselorID: senderId,
            studentID: userToChatWithId,
            text: message,
            timestamp: new Date()
        };

        res.status(200).json(newMessage);


        const receiverSocketId = getReceiverSocketId(userToChatWithId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage); //TODO: Optimize this later
        }
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}   