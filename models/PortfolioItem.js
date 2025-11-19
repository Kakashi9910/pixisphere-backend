import mongoose from 'mongoose';

const { Schema } = mongoose;

const portfolioSchema = new Schema({
  partner: { type: Schema.Types.ObjectId, ref: 'PartnerProfile', required: true },
  title: String,
  description: String,
  url: String,
  index: Number,
  createdAt: { type: Date, default: Date.now }
});

const PortfolioItem = mongoose.model('PortfolioItem', portfolioSchema);
export default PortfolioItem;
