import User from '../models/User.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import { generateToken } from '../utils/jwt.js';
import { sendEmail } from '../utils/email.js';
import { getResetPasswordTemplate } from '../utils/emailTemplates.js';
import crypto from 'crypto';
import validator from 'validator';
import { promises as dns } from 'dns';
import disposableDomains from 'disposable-email-domains' with { type: 'json' };


// Check if email domain is valid
const isValidEmailDomain = async (email) => {
    try {
        const domain = email.split('@')[1].toLowerCase();
        await dns.resolveMx(domain);
        return true;
    } catch (err) {
        return false;
    }
};


// Check if email is valid and not disposable
const isValidEmail = async (email) => {
    if (!validator.isEmail(email)) {
        return { valid: false, error: 'Invalid email format' };
    }
    const domain = email.split('@')[1].toLowerCase();

    if (disposableDomains.includes(domain)) {
        return { valid: false, error: 'Disposable emails are not allowed' };
    }
    if (!(await isValidEmailDomain(email))) {
        return { valid: false, error: 'Invalid email domain. Please use a trusted email provider.' };
    }
    return { valid: true, error: '' };
};


// Register User
export const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const emailValidation = await isValidEmail(email);
        if (!emailValidation.valid) {
            return res.status(400).json({ error: emailValidation.error });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: 'Email address is already registered'
            });
        }
        const user = await User.create({ fullName, email, password });
        const token = generateToken(user._id);
        res.status(201).json({
            user: { id: user._id, fullName, email },
            token
        });
    } catch (err) {
        res.status(500).json({
            error: 'Failed to register user: ' + err.message
        });
    }
};


// Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.verifyPassword(password))) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }
        const token = generateToken(user._id);
        res.json({
            user: { id: user._id, fullName: user.fullName, email },
            token
        });
    } 
    catch (err) {
        res.status(500).json({
            error: 'Failed to log in: ' + err.message
        });
    }
};


// Update User profile
export const updateUserProfile = async (req, res) => {
    const { fullName } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        user.fullName = fullName || user.fullName;
        await user.save();
        res.json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        res.status(500).json({
            error: 'Failed to update profile: ' + err.message
        });
    }
};


// Update Password
export const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (!(await user.verifyPassword(currentPassword))) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();
        res.json({
            message: 'Password updated successfully'
        });

    } catch (err) {
        res.status(500).json({
            error: 'Failed to update password: ' + err.message
        });
    }
};


// Delete User Account
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await Job.deleteMany({ user: req.user._id });
        await User.deleteOne({ _id: req.user._id });
        res.json({ message: 'Account deleted successfully' });

    } catch (err) {
        res.status(500).json({
            error: 'Failed to delete account: ' + err.message
        });
    }
};


// Forgot Password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const emailValidation = await isValidEmail(email);
        if (!emailValidation.valid) {
            return res.status(400).json({ error: emailValidation.error });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Rate limiting
        const resetAttempts = user.resetAttempts || [];
        const oneHourAgo = Date.now() - 3600000;
        const recentAttempts = resetAttempts.filter(attempt => attempt > oneHourAgo);
        if (recentAttempts.length >= 3) {
            return res.status(429).json({ error: 'Too many reset attempts. Try again after 1 hour.' });
        }

        // Generate and save reset code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetCode = resetCode;
        user.resetCodeExpiry = Date.now() + 3600000;
        user.resetAttempts = [...recentAttempts, Date.now()];
        await user.save();

        await sendEmail(
            email,
            'Password Reset Request',
            getResetPasswordTemplate(user.fullName, resetCode)
        );
        res.json({ message: 'A 6-digit reset code has been sent to your email' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send reset code: ' + err.message });
    }
};


// Reset Password
export const resetPassword = async (req, res) => {
    const { password, code } = req.body;
    try {
        const user = await User.findOne({
            resetCode: code,
            resetCodeExpiry: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset code' });
        }
        user.password = password;
        user.resetCode = undefined;
        user.resetCodeExpiry = undefined;
        user.resetAttempts = [];
        await user.save();
        res.json({ message: 'Password has been reset successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to reset password: ' + err.message });
    }
};


// Get Current User
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('fullName email createdAt');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ 
            id: user._id, 
            fullName: user.fullName, 
            email: user.email, 
            createdAt: user.createdAt 
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user: ' + err.message });
    }
};


// Enable Notifications
export const enableNotifications = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const jobs = await Job.find({ user: user._id });
        if (jobs.length === 0) {
            return res.status(200).json({ message: 'No jobs found to enable notifications' });
        }

        const result = await Job.updateMany({ user: user._id }, { reminderOn: true });
        res.json({ message: `Enabled notifications for all jobs (${result.modifiedCount} jobs updated)` });
        
    } catch (err) {
        res.status(500).json({ error: 'Failed to enable notifications: ' + err.message });
    }
};