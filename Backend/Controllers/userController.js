const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// 1. Helper: Create Token (This was missing in your snippet)
const createToken = (payload) => {
    // Make sure you have JWT_SECRET in your .env file, or use a fallback string for testing
    const secret = process.env.JWT_SECRET || 'fallback_secret_key'; 
    return jwt.sign(payload, secret, {
        expiresIn: "7d", 
    });
};

// 2. Helper: Load Users from local JSON file
const getUsers = () => {
    try {
        // __dirname = current folder (controllers)
        // '..'      = go up one level (project root)
        // 'data'    = go into data folder
        // 'users.json' = the file
        const filePath = path.join(__dirname, '../data/user.json'); 
         
        const dataBuffer = fs.readFileSync(filePath);
        return JSON.parse(dataBuffer.toString());
    } catch (error) {
        console.error("Error reading database:", error);
        // If file is missing or empty, return empty array to prevent crash
        return [];
    }
};

// 3. Controller: Login User
exports.loginUser = (req, res) => {
    try {
        const { username, password } = req.body;

        // A. Validation
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide both username and password' 
            });
        }

        // B. Load Data & Find User
        const users = getUsers();
        
        // Check for exact username AND password match
        const user = users.find((u) => u.username === username && u.password === password);

        // C. Check Credentials
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }

        // D. Create Token
        const token = createToken({ username: user.username });

        // E. Send Response
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                username: user.username
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
};
