import PartnerProfile from '../models/PartnerProfile.js';
import PortfolioItem from '../models/PortfolioItem.js';
import Inquiry from "../models/Inquiry.js";
import User from '../models/User.js';


export const createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const payload = req.body;
    let profile = await PartnerProfile.findOne({ user: userId });
    if (!profile) {
      profile = new PartnerProfile({ user: userId, ...payload });
    } else {
      Object.assign(profile, payload);
    }
    profile.verification.status = 'pending';
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed', details: err.message });
  }
};

export const addPortfolio = async (req, res) => {
  try {
    const { title, description, url, index } = req.body;
    console.log('###########3',req.user._id);
    const partnerProfile = await PartnerProfile.findOne({ user: req.user._id });
    if (!partnerProfile) return res.status(400).json({ error: 'Partner profile not found' });
    const item = new PortfolioItem({
      partner: partnerProfile._id,
      title,
      description,
      url: url || 'https://via.placeholder.com/800',
      index: index || 0
    });
    await item.save();
    partnerProfile.portfolio.push(item._id);
    await partnerProfile.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add portfolio', details: err.message });
  }
};

export const reorderPortfolio = async (req, res) => {
  try {
    const { order } = req.body; // [{ id, index }]
    const ops = order.map(o => PortfolioItem.findByIdAndUpdate(o.id, { index: o.index }));
    await Promise.all(ops);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reorder', details: err.message });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    await PortfolioItem.findByIdAndDelete(id);
    await PartnerProfile.updateOne({ portfolio: id }, { $pull: { portfolio: id } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete', details: err.message });
  }
};


export const getAssignedLeads = async (req, res) => {
  try {
    const partnerId = req.user.id; // JWT decoded ID

    const leads = await Inquiry.find({
      assignedTo: partnerId   // FIX: partnerId must be inside array
    })
    .populate("client", "name email")
    .populate("assignedTo", "name email");

    res.json({ success: true, count: leads.length, leads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const partnerOnboarding = async (req, res) => {
  try {
    const partnerId = req.user.id;  // user id from auth middleware
    const {
      personalDetails,
      serviceDetails,
      documentMetadata,
      portfolio,
    } = req.body;

    // Find the partner user
    const partner = await User.findById(partnerId);
    if (!partner || partner.role !== 'partner') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update partner fields
    partner.personalDetails = personalDetails;
    partner.serviceDetails = serviceDetails;
    partner.documentMetadata = documentMetadata;
    partner.portfolio = portfolio;
    partner.verificationStatus = 'pending';

    await partner.save();

    res.status(200).json({ message: 'Onboarding submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

