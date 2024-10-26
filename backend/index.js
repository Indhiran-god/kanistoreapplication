// Import necessary modules
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db'); // Ensure your database connection is configured
const router = require('./routes'); // Ensure routes are correctly set up in './routes'

// Initialize the Express app
const app = express();

// Middleware to handle CORS, JSON, and cookies
app.use(cors({
    origin: ['https://kanistoreapplication.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser()); // Parse cookies from requests

// Use the router for API routes
app.use("/api", router);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!'); // Send a generic error message
});

// Set the port to either the environment variable or 8080
const PORT = process.env.PORT || 8080;

// Connect to the database and start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Connected to DB");
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to connect to DB:", error);
});
