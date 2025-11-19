import express from 'express';
import auth from '../middlewares/auth.js';
import { requireRole } from '../middlewares/roles.js';
import {
  createOrUpdateProfile,
  addPortfolio,
  reorderPortfolio,
  deletePortfolio,
  getAssignedLeads,
  partnerOnboarding
} from '../controllers/partnerController.js';

const router = express.Router();

router.use(auth);
router.post('/profile', requireRole('partner'), createOrUpdateProfile);
router.post('/portfolio', requireRole('partner'), addPortfolio);
router.put('/portfolio/reorder', requireRole('partner'), reorderPortfolio);
router.delete('/portfolio/:id', requireRole('partner'), deletePortfolio);
router.get("/leads", auth, requireRole("partner"), getAssignedLeads);
router.post(
  '/onboarding',
  auth,
  requireRole("partner"),
  partnerOnboarding
);


export default router;
