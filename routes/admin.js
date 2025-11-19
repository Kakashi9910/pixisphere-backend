import express from 'express';
import auth from '../middlewares/auth.js';
import { requireRole } from '../middlewares/roles.js';
import { getPendingVerifications, verifyPartner, getKPIs } from '../controllers/adminController.js';

const router = express.Router();

router.use(auth, requireRole('admin'));
router.get('/verifications', getPendingVerifications);
router.put('/verify/:id', verifyPartner);
router.get('/kpis', getKPIs);

export default router;
