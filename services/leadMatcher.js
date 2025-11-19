import PartnerProfile from '../models/PartnerProfile.js';

export const matchPartnersForInquiry = async (inquiry) => {
  const { category, tags, city } = inquiry;
  // match verified partners in same city that match category or tags
  const partners = await PartnerProfile.find({
    'verification.status': 'verified',
    $or: [
      { categories: category },
      { tags: { $in: tags || [] } }
    ],
    city
  }).populate('user');

  if (partners.length < 5) {
    const more = await PartnerProfile.find({
      'verification.status': 'verified',
      categories: category
    }).populate('user');
    const map = new Map();
    partners.concat(more).forEach(p => map.set(p._id.toString(), p));
    return Array.from(map.values()).slice(0, 10);
  }

  return partners.slice(0, 10);
};
