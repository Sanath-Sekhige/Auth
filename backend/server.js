import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import helmet from 'helmet';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Set client URL based on environment
const clientURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : process.env.CLIENT_URL;

// Setup CORS options
const corsOptions = {
    origin: '*', // Allow all origins (for testing purposes)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  };  
app.use(cors(corsOptions));

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

// Middleware to parse incoming JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Debugging middleware to log incoming requests
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log('Request URL:', req.url); // Logs all incoming requests
        next();
    });
}

// API Routes
app.use('/api/auth', authRoutes);

// Serve static files from React build for production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

// Start the server and connect to the database
const startServer = async () => {
    try {
        await connectDB(); // Ensure DB connection is successful
        app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
    } catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1); // Exit the process if DB connection fails
    }
};

startServer();
