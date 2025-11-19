import mongoose from 'mongoose';

const { Schema } = mongoose;

const partnerProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  about: String,
  categories: [String],
  city: String,
  tags: [String],
  documents: [{
    type: { type: String },
    number: String,
    metadata: Object
  }],
  portfolio: [{ type: Schema.Types.ObjectId, ref: 'PortfolioItem' }],
  verification: {
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    adminComment: String,
    updatedAt: Date
  },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const PartnerProfile = mongoose.model('PartnerProfile', partnerProfileSchema);
export default PartnerProfile;
