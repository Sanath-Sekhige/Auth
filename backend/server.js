import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import helmet from 'helmet'; // Added for enhanced security

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const clientURL = import.meta.env.MODE === "development" 
  ? 'http://localhost:3000' 
  : process.env.CLIENT_URL;

// Setup CORS options
const corsOptions = {
    origin: clientURL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));

// Security Middleware: Helmet to help secure the app by setting various HTTP headers
app.use(helmet());

// Middleware to parse incoming JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

// Serve static files from React build for production
if (process.env.NODE_ENV === 'production') {
    // Set up a static folder for the frontend build
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    // Catch-all handler to serve index.html for any route that is not an API call
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

// Debugging middleware to log incoming requests - only in development mode
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log('Request URL:', req.url); // Logs all incoming requests
        next();
    });
}

app.listen(PORT, () => {
    try {
        connectDB(); // Ensure DB connection is successful
        console.log(`Server is running on port: ${PORT}`);
    } catch (error) {
        console.error('Failed to connect to database:', error);
    }
});
