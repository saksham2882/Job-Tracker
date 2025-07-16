import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    resetCode: {
        type: String
    },
    resetCodeExpiry: {
        type: Date
    },
    resetAttempts: {
        type: [Number],
        default: []
    },
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);