const mongoose = require('mongoose');
const User = require('./user.model');
const Quote = require('./quote.model');
// Define user type
const userType = ['taskGenie', 'poster'];

const reviewSchema = new mongoose.Schema({
  reviewID: {
    type: String,
    required: true,
  },
  submitterUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  recipientUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  quoteID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Quote,
    required: true,
  },
  userType: {
    type: String,
    enum: [userType],
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
