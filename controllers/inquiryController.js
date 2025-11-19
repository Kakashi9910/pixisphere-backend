import Inquiry from '../models/Inquiry.js';
import { matchPartnersForInquiry } from '../services/leadMatcher.js';

export const createInquiry = async (req, res) => {
  try {
    const { category, date, budget, city, referenceImage, tags } = req.body;
    const inquiry = new Inquiry({
      client: req.user._id,
      category,
      date,
      budget,
      city,
      referenceImage,
      tags
    });
    await inquiry.save();

    const partners = await matchPartnersForInquiry(inquiry);
    const partnerIds = partners.map(p => p.user._id);
    inquiry.assignedTo = partnerIds;
    await inquiry.save();

    const assigned = partners.map(p => ({ id: p.user._id, name: p.user.name, city: p.city, categories: p.categories }));
    res.json({ inquiry, assigned });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create inquiry', details: err.message });
  }
};

export const getPartnerLeads = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ assignedTo: req.user._id }).populate('client').sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: 'Failed', details: err.message });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) return res.status(404).json({ error: 'Not found' });
    inquiry.status = status;
    await inquiry.save();
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update', details: err.message });
  }
};
