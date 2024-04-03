import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour name is required'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'Tour duration is required'],
  },

  maxGroupSize: {
    type: Number,
    required: [true, 'Tour group size is required'],
  },

  difficulty: {
    type: String,
    required: [true, 'Tour difficulty is required'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult',
    },
  },

  ratingsAverage: {
    type: Number,
    default: 4.5,
    // min: [1, 'Rating must be above 1.0'],
    // max: [5, 'Rating must be below 5.0'],
    // // DOUBT:
    // set: (val) => Math.round(val * 10) / 10,
  },

  ratingsQuantity: {
    type: Number,
    default: 0,
  },

  rating: {
    type: Number,
    default: 4.5,
  },

  price: {
    type: Number,
    required: [true, 'Tour price is required'],
  },
  priceDiscount: {
    type: Number,
  },

  summary: {
    type: String,
    trim: true,
    required: [true, 'Tour summary is required'],
  },

  description: {
    type: String,
    trim: true,
  },

  imageCover: {
    type: String,
    required: [true, 'Tour image cover is required'],
  },

  images: [String],

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  startDates: [Date],
});

export const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);
