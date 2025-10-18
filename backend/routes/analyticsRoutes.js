import express from 'express';
import { auth } from '../middleware/auth.js';
import {
    getJobStatusDistribution,
    getApplicationsBySource,
    getApplicationsOverTime,
    getSuccessRates,
} from '../controllers/analyticsController.js';

const router = express.Router();

// Protect all analytics routes
router.use(auth);

router.get('/status-distribution', getJobStatusDistribution);
router.get('/applications-by-source', getApplicationsBySource);
router.get('/applications-over-time', getApplicationsOverTime);
router.get('/success-rates', getSuccessRates);

export default router;