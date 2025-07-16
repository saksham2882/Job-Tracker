import express from 'express';
import { getNotifications, markAsRead, deleteNotification } from '../controllers/notificationController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.use(auth);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;