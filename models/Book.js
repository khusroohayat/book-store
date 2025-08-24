const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  body: { type: String, required: true }
}, { _id: false });

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genres: { type: [String], required: true },
  pages: { type: Number, required: true },
  rating: { type: Number, required: true },
  reviews: { type: [reviewSchema], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
