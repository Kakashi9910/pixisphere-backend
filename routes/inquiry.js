import express from 'express';
import auth from '../middlewares/auth.js';
import { requireRole } from '../middlewares/roles.js';
import { createInquiry, getPartnerLeads, updateInquiryStatus } from '../controllers/inquiryController.js';

const router = express.Router();

router.post('/', auth, requireRole('client'), createInquiry);
router.get('/partner/leads', auth, requireRole('partner'), getPartnerLeads);
router.put('/:id/status', auth, updateInquiryStatus);

export default router;
