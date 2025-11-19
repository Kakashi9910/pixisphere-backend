import mongoose from 'mongoose';

const { Schema } = mongoose;

const inquirySchema = new Schema({
  client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: String,
  date: Date,
  budget: Number,
  city: String,
  referenceImage: String,
  tags: [String],
  assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['new', 'responded', 'booked', 'closed'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
  responses: [{
    partner: { type: Schema.Types.ObjectId, ref: 'User' },
    message: String,
    createdAt: Date
  }]
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
