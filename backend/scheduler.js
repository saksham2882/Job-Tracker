import dotenv from 'dotenv';
dotenv.config();
import cron from 'node-cron';
import mongoose from 'mongoose';
import Job from './models/Job.js';
import Interview from './models/Interview.js';
import Notification from './models/Notification.js';

cron.schedule('*/1 * * * *', async () => {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const normalizeDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const jobs = await Job.find({
            reminderOn: true,
            deadlineDate: { $exists: true, $ne: null }
        }).populate('user');
        
        for (const job of jobs) {
            const deadline = normalizeDate(job.deadlineDate);
            const daysUntilDeadline = Math.round((deadline - today) / (24 * 60 * 60 * 1000));

            if (daysUntilDeadline === 1 || daysUntilDeadline === 2) {
                const message = `Reminder: Deadline for ${job.role} at ${job.companyName} is ${daysUntilDeadline === 1 ? 'tomorrow' : 'in 2 days'} on ${new Date(job.deadlineDate).toLocaleDateString()}.`;
                const exists = await Notification.findOne({
                    user: job.user._id,
                    message,
                    createdAt: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
                });
                if (!exists) {
                    await Notification.create({
                        user: job.user._id,
                        message
                    });
                }
            }
        }

        const interviews = await Interview.find({
            interviewDate: { $exists: true, $ne: null }
        }).populate('job');

        for (const interview of interviews) {
            const interviewDate = normalizeDate(interview.interviewDate);
            const daysLeft = Math.round((interviewDate - today) / (24 * 60 * 60 * 1000));

            if (daysLeft === 1 || daysLeft === 2) {
                const message = `Reminder: Interview for ${interview.job.role} at ${interview.job.companyName} (Round: ${interview.round}) is ${daysLeft === 1 ? 'tomorrow' : 'in 2 days'} on ${new Date(interview.interviewDate).toLocaleDateString()}.`;
                const exists = await Notification.findOne({
                    user: interview.job.user._id,
                    message,
                    createdAt: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
                });
                if (!exists) {
                    await Notification.create({
                        user: interview.job.user._id,
                        message
                    });
                }
            }
        }
    } catch (err) {
        // console.error('Scheduler error:', err);
    }
});