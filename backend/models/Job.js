import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Interview', 'Offered', 'Rejected', 'Accepted'],
        default: 'Applied',
    },
    applicationDate: {
        type: Date,
        default: Date.now
    },
    deadlineDate: {
        type: Date
    },
    source: {
        type: String,
        trim: true
    },
    sourceLink: {
        type: String,
        trim: true,
    },
    priorityLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    jobDescription: {
        type: String,
        trim: true
    },
    resumePath: {
        type: String
    },
    interviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview'
    }],
    isPinned: {
        type: Boolean,
        default: false,
    },
    notes: {
        type: String,
        default: "",
    },
    reminderOn: {
        type: Boolean,
        default: false
    },
    location: {
        type: String,
        trim: true,
    },
    stipendOrSalary: {
        type: Number,
        min: 0,
    },
}, {
    timestamps: true
});

export default mongoose.model('Job', jobSchema);