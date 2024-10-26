// Import required modules
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const router = require('./routes');

const app = express();

// Define allowed origins
const allowedOrigins = ['https://kanistoreapplication-8kuw-iphall5nc-indhiran-gods-projects.vercel.app','https://kanistoreapplication-8kuw.vercel.app'];

// CORS configuration
app.use(cors({
    origin: allowedOrigins,  // Allow your frontend URL
    credentials: true,       // Allow credentials like cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware
app.use(cookieParser());
app.use(express.json());

// Set a response timeout
app.use((req, res, next) => {
    res.setTimeout(30000, () => {  // 30 seconds timeout
        console.log('Request has timed out.');
        res.sendStatus(408);  // Send a 408 Request Timeout status code
    });
    next();
});

// Handle CORS preflight requests across all routes
app.options('*', cors());  // Preflight for all routes

// API Routes
app.use("/api", router);

// Set port for Vercel environment
const PORT = process.env.PORT || 8080; // Use PORT from environment variable or default to 8080

// Start server and connect to DB
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Connected to DB");
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error("Database connection failed:", err.message);
});
