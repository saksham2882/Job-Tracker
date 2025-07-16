import express from 'express';
import { registerUser, loginUser, updateUserProfile, updatePassword, forgotPassword, resetPassword, getCurrentUser, deleteUser, enableNotifications } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', auth, getCurrentUser);
router.put('/profile', auth, updateUserProfile);
router.put('/password', auth, updatePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.delete('/delete', auth, deleteUser);
router.post('/notification-settings', auth, enableNotifications);

export default router;