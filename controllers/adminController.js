import User from '../models/User.js';
import PartnerProfile from '../models/PartnerProfile.js';
import Inquiry from '../models/Inquiry.js';

export const getPendingVerifications = async (req, res) => {
  try {
    const pending = await PartnerProfile.find({ 'verification.status': 'pending' }).populate('user');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: 'Failed', details: err.message });
  }
};

export const verifyPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, comment } = req.body;
    const profile = await PartnerProfile.findById(id).populate('user');
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    profile.verification.status = action === 'approve' ? 'verified' : 'rejected';
    profile.verification.adminComment = comment;
    profile.verification.updatedAt = new Date();
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed', details: err.message });
  }
};

export const getKPIs = async (req, res) => {
  try {
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalPartners = await User.countDocuments({ role: 'partner' });
    const pendingVerifications = await PartnerProfile.countDocuments({ 'verification.status': 'pending' });
    const totalInquiries = await Inquiry.countDocuments();
    res.json({ totalClients, totalPartners, pendingVerifications, totalInquiries });
  } catch (err) {
    res.status(500).json({ error: 'Failed', details: err.message });
  }
};
