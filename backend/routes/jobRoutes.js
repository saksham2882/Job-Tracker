import express from 'express';
import { addJob, getJobs, getJob, updateJob, deleteJob, toggleReminder, disableNotifications, getJobDetails, togglePin, uploadResumeHandler } from '../controllers/jobController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.use(auth);

router.post('/', addJob);
router.post('/upload', uploadResumeHandler);
router.get('/', getJobs);
router.get('/disable-notifications', disableNotifications);
router.get('/:id', getJob);
router.get('/:id/details', getJobDetails);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);
router.patch('/:id/reminder', toggleReminder);
router.patch('/:id/pin', togglePin);

export default router;