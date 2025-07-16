import Job from '../models/Job.js';
import Interview from '../models/Interview.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { uploadResume } from '../utils/cloudinaryUpload.js';


// Upload resume handler
export const uploadResumeHandler = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
        }
        if (!req.files?.resume) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const resumePath = await uploadResume(req.files.resume, process.env.CLOUDINARY_UPLOAD_PRESET);
        res.json({ resumePath });
    } catch (err) {
        res.status(500).json({ error: 'Failed to upload resume: ' + err.message });
    }
};


// Add a new job
export const addJob = async (req, res) => {
    const { companyName, role, status, applicationDate, deadlineDate, source, sourceLink, priorityLevel, jobDescription, reminderOn, interviews, notes, location, stipendOrSalary, resumePath } = req.body;
    try {
        if (!req.user?._id) {
            return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
        }
        const job = await Job.create({
            user: req.user._id,
            companyName, role, status, applicationDate, deadlineDate, source, sourceLink, priorityLevel, jobDescription,
            resumePath: resumePath || "",
            reminderOn: reminderOn || false,
            notes: notes || "",
            location, stipendOrSalary,
        });

        let created = [];
        if (interviews && Array.isArray(interviews) && interviews.length > 0) {
            for (const interview of interviews) {
                if (!interview.round || !interview.interviewDate) {
                    throw new Error('Invalid interview data: round and interview date are required');
                }
                const newInterview = await Interview.create({
                    job: job._id,
                    round: interview.round,
                    interviewDate: interview.interviewDate,
                    status: interview.status || 'Scheduled',
                    comments: interview.comments || '',
                });
                job.interviews.push(newInterview._id);
                created.push(newInterview);
            }
            await job.save();
        }
        await Notification.create({
            user: req.user._id,
            message: `Job added: ${job.role} at ${job.companyName}`
        });

        if (created.length > 0) {
            await Notification.create({
                user: req.user._id,
                message: `Added ${created.length} interviews for ${job.role} at ${job.companyName}`
            });
        }
        res.status(201).json({ ...job.toObject(), interviews: created });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add job: ' + err.message });
    }
};


// Get a specific job by ID
export const getJob = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, user: req.user._id }).populate('interviews');
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch job: ' + err.message });
    }
};


// Get list of jobs for a user
export const getJobs = async (req, res) => {
    const { status, priorityLevel, isPinned, search, source, location, sort } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'All') {
        query.status = status;
    }
    if (priorityLevel && priorityLevel !== 'All') {
        query.priorityLevel = priorityLevel;
    }
    if (isPinned && isPinned !== 'All') {
        query.isPinned = isPinned === 'Pinned';
    }
    if (search) {
        query.$or = [
            { companyName: { $regex: search, $options: 'i' } },
            { role: { $regex: search, $options: 'i' } },
        ];
    }
    if (source) {
        query.source = { $regex: source, $options: 'i' };
    }
    if (location) {
        query.location = { $regex: location, $options: 'i' };
    }

    try {
        let jobs;
        if (sort === 'priorityLevel-desc') {
            jobs = await Job.aggregate([
                { $match: query },
                {
                    $addFields: {
                        priorityValue: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ['$priorityLevel', 'High'] }, then: 3 },
                                    { case: { $eq: ['$priorityLevel', 'Medium'] }, then: 2 },
                                    { case: { $eq: ['$priorityLevel', 'Low'] }, then: 1 },
                                ],
                                default: 0,
                            },
                        },
                    },
                },
                { $sort: { priorityValue: -1, companyName: 1 } },
                {
                    $lookup: {
                        from: 'interviews',
                        localField: 'interviews',
                        foreignField: '_id',
                        as: 'interviews',
                    },
                },
            ]);
        } else {
            let sortOption = { applicationDate: -1 };
            if (sort) {
                if (sort === 'applicationDate-desc') sortOption = { applicationDate: -1 };
                else if (sort === 'applicationDate-asc') sortOption = { applicationDate: 1 };
                else if (sort === 'deadlineDate-asc') sortOption = { deadlineDate: 1 };
            }
            jobs = await Job.find(query).populate('interviews').sort(sortOption);
        }
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch jobs: ' + err.message });
    }
};


// Get a job with all its details
export const getJobDetails = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id })
            .populate('interviews')
            .lean();
        if (!job) return res.status(404).json({ error: 'Job not found' });

        res.json({ job });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch job details: ' + err.message });
    }
};


// Update a job
export const updateJob = async (req, res) => {
    const { companyName, role, status, applicationDate, deadlineDate, source, sourceLink, priorityLevel, jobDescription, reminderOn, interviews, notes, location, stipendOrSalary, resumePath } = req.body;
    try {
        if (!req.user?._id) {
            return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
        }
        const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        job.companyName = companyName;
        job.role = role;
        job.status = status;
        job.applicationDate = applicationDate;
        job.deadlineDate = deadlineDate;
        job.source = source;
        job.sourceLink = sourceLink;
        job.priorityLevel = priorityLevel;
        job.jobDescription = jobDescription;
        job.resumePath = resumePath || job.resumePath || "";
        job.reminderOn = reminderOn || false;
        job.notes = notes || job.notes || "";
        job.location = location;
        job.stipendOrSalary = stipendOrSalary;

        await Interview.deleteMany({ job: job._id });
        job.interviews = [];
        let created = [];

        if (interviews && Array.isArray(interviews) && interviews.length > 0) {
            for (const interview of interviews) {
                if (!interview.round || !interview.interviewDate) {
                    throw new Error('Invalid interview data: round and interview date are required');
                }
                const newInterview = await Interview.create({
                    job: job._id,
                    round: interview.round,
                    interviewDate: interview.interviewDate,
                    status: interview.status || 'Scheduled',
                    comments: interview.comments || '',
                });
                job.interviews.push(newInterview._id);
                created.push(newInterview);
            }
        }
        await job.save();

        await Notification.create({
            user: req.user._id,
            message: `Job updated: ${job.role} at ${job.companyName}`
        });
        if (created.length > 0) {
            await Notification.create({
                user: req.user._id,
                message: `Updated ${created.length} interviews for ${job.role} at ${job.companyName}`
            });
        }
        res.json({ ...job.toObject(), interviews: created });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update job: ' + err.message });
    }
};


// Delete a job
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        await Interview.deleteMany({ job: req.params.id });
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete job: ' + err.message });
    }
};



// Toggle reminder for a job
export const toggleReminder = async (req, res) => {
    const { reminderOn } = req.body;
    try {
        const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
        if (!job){
            return res.status(404).json({ error: 'Job not found' });
        }

        job.reminderOn = reminderOn;
        await job.save();
        res.json({
            message: `Reminder ${reminderOn ? 'enabled' : 'disabled'}`, 
            reminderOn: job.reminderOn 
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to toggle reminder: ' + err.message });
    }
};


// Disable notifications for all jobs
export const disableNotifications = async (req, res) => {
    const { email } = req.query;
    try {
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const user = await User.findOne({ email });
        const jobs = await Job.find({ user: user._id });

        if (jobs.length === 0) {
            return res.status(200).json({ message: 'No jobs found to disable notifications' });
        }

        const result = await Job.updateMany({ user: user._id }, { reminderOn: false });
        res.json({ 
            message: `Disabled notifications for all jobs (${result.modifiedCount} jobs updated)` 
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to disable notifications: ' + err.message });
    }
};


// Toggle pin status for a job
export const togglePin = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        job.isPinned = !job.isPinned;
        await job.save();

        res.json({ 
            message: `Job ${job.isPinned ? 'pinned' : 'unpinned'}: ${job.role} at ${job.companyName}`, 
            isPinned: job.isPinned 
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to toggle pin: ' + err.message });
    }
};