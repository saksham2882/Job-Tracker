import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import fileUpload from 'express-fileupload';
import './scheduler.js';

dotenv.config();
const app = express();

// Rate limiter for forgot password
const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { error: 'Too many requests from this IP, please try again after 1 hour' },
});
app.use('/api/users/forgot-password', forgotPasswordLimiter);


// middleware
app.use(cors({ 
    origin: process.env.CLIENT_URL || 'https://trackmyjobs.vercel.app', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));


// wakeUp Endpoint
app.get('/api/health', (req, res) => res.status(200).json({ status: 'OK' }));

// Routes
app.get('/', (req, res) => res.status(200).json({ message: 'JobTracker Backend API Working', status: 'OK' }))

app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

connectDB().then(() => {
    mongoose.model('Job').ensureIndexes({
        user: 1,
        deadlineDate: 1,
        status: 1
    });
    mongoose.model('Notification').ensureIndexes({
        user: 1,
        createdAt: -1,
        isRead: 1
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));