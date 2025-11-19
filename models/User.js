import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const portfolioEntrySchema = new Schema({
  imageUrl: String,
  description: String,
});

const userSchema = new Schema({
  role: { type: String, enum: ['client', 'partner', 'admin'], required: true },
  name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  password: String,
  isPhoneVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },

  // Partner onboarding fields
  personalDetails: {
    aadharNumber: String,        // Example sensitive info
    address: String,             // Optional address field
  },
  serviceDetails: {
    category: String,            // e.g., wedding, maternity, birthday
    experienceYears: Number,
    description: String,         // Short intro or service description
  },
  documentMetadata: {
    aadharUrl: String,           // URL to uploaded Aadhar document or similar
  },
  portfolio: [portfolioEntrySchema],  // Array of portfolio images + descriptions

  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
