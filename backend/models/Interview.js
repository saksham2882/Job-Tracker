import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    round: {
        type: String,
        required: true,
        enum: ['Coding', 'Technical', 'Aptitude', 'Group Discussion', 'HR', 'System Design', 'Behavioral', 'Final', 'Other']
    },
    interviewDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    comments: {
        type: String, trim: true, default: ''
    },
}, {
    timestamps: true
});

export default mongoose.model('Interview', interviewSchema);