import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(300);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { isRead: true },
            { new: true }
        );
        if (!notification){
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete(
            { _id: req.params.id, user: req.user._id }
        );
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.json({ message: 'Notification deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete notification' });
    }
};