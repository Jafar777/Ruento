import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
  يوم: String,
  عنوان: String,
  وصف: String
});

const contactInfoSchema = new mongoose.Schema({
  هاتف: String,
  إيميل: String,
  موقع: String,
  دردشة: String
});

const serviceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['plans', 'transportation', 'hotels', 'residence', 'restaurants', 'tourist-attractions', 'events', 'shopping', 'museums', 'natural-places']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '📋'
  },
  images: [String],
  duration: {
    type: String,
    default: '3-7 أيام'
  },
  groupSize: {
    type: String,
    default: '2-12 شخص'
  },
  availability: {
    type: String,
    default: 'على مدار السنة'
  },
  locations: [String],
  price: {
    type: Number,
    default: 499
  },
  priceUnit: {
    type: String,
    default: 'للشخص'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.5
  },
  features: [String],
  itinerary: [itinerarySchema],
  contactInfo: contactInfoSchema,
  benefits: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
export default Service;