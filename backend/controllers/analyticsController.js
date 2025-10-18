import Job from '../models/Job.js';
import mongoose from 'mongoose';

const buildMatchQuery = (userId, jobTitle, company, source) => {
    const matchQuery = { user: new mongoose.Types.ObjectId(userId) };
    if (jobTitle) {
        matchQuery.role = { $regex: jobTitle, $options: 'i' }; // Case-insensitive search
    }
    if (company) {
        matchQuery.companyName = { $regex: company, $options: 'i' };
    }
    if (source) {
        matchQuery.source = source;
    }
    return matchQuery;
};


// @desc    Get job status distribution for the authenticated user
// @route   GET /api/analytics/status-distribution
// @access  Private
const getJobStatusDistribution = async (req, res) => {
    try {
        const userId = req.user._id;
        const { jobTitle, company, source } = req.query;

        const matchQuery = buildMatchQuery(userId, jobTitle, company, source);

        const statusDistribution = await Job.aggregate([
            { $match: matchQuery },
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $project: { status: '$_id', count: 1, _id: 0 } }
        ]);

        res.status(200).json(statusDistribution);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get applications breakdown by source for the authenticated user
// @route   GET /api/analytics/applications-by-source
// @access  Private
const getApplicationsBySource = async (req, res) => {
    try {
        const userId = req.user._id;
        const { jobTitle, company, source } = req.query;

        const matchQuery = buildMatchQuery(userId, jobTitle, company, source);

        const applicationsBySource = await Job.aggregate([
            { $match: matchQuery },
            { $group: { _id: '$source', count: { $sum: 1 } } },
            { $project: { source: '$_id', count: 1, _id: 0 } }
        ]);

        res.status(200).json(applicationsBySource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get applications over time for the authenticated user
// @route   GET /api/analytics/applications-over-time
// @access  Private
const getApplicationsOverTime = async (req, res) => {
    try {
        const userId = req.user._id;
        const { jobTitle, company, source } = req.query;

        const matchQuery = buildMatchQuery(userId, jobTitle, company, source);

        const groupFormat = { $dateToString: { format: '%Y-%m', date: '$applicationDate' } };

        const applicationsOverTime = await Job.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: groupFormat,
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $project: { date: '$_id', count: 1, _id: 0 } }
        ]);

        res.status(200).json(applicationsOverTime);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get application success rates for the authenticated user
// @route   GET /api/analytics/success-rates
// @access  Private
const getSuccessRates = async (req, res) => {
    try {
        const userId = req.user._id;
        const { jobTitle, company, source } = req.query;

        const matchQuery = buildMatchQuery(userId, jobTitle, company, source);

        const totalApplications = await Job.countDocuments(matchQuery);

        const acceptedApplications = await Job.countDocuments({ ...matchQuery, status: 'Accepted' });
        const offeredApplications = await Job.countDocuments({ ...matchQuery, status: 'Offered' });
        const interviewApplications = await Job.countDocuments({ ...matchQuery, status: 'Interview' });

        const successRates = [];

        if (totalApplications > 0) {
            successRates.push({
                stage: 'Applied to Interview',
                rate: (interviewApplications / totalApplications) * 100
            });
            successRates.push({
                stage: 'Applied to Offered',
                rate: (offeredApplications / totalApplications) * 100
            });
            successRates.push({
                stage: 'Applied to Accepted',
                rate: (acceptedApplications / totalApplications) * 100
            });
        }

        res.status(200).json(successRates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getJobStatusDistribution,
    getApplicationsBySource,
    getApplicationsOverTime,
    getSuccessRates,
};
