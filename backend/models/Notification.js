import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '15d'
    }
}, {
    indexes: [
        { key: { user: 1, message: 1, createdAt: -1 } }
    ]
});

export default mongoose.model('Notification', notificationSchema);