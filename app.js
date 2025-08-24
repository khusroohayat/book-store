require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Book = require('./models/Book');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// POST /api/books - Add a new book
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, genres, pages, rating, reviews } = req.body;
    if (!title || !author || !genres || !pages || !rating || !reviews) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const book = new Book({ title, author, genres, pages, rating, reviews });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    console.error('Error creating book:', err);
    res.status(500).json({ error: 'Server error.', details: err.message });
  }
});

// GET /api/books - List all books (with pagination)
app.get('/api/books', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const books = await Book.find().skip(skip).limit(limit);
    const total = await Book.countDocuments();
    res.status(200).json({ books, total, page, limit });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/books/:id - Get single book
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found.' });
    res.status(200).json(book);
  } catch (err) {
    res.status(404).json({ error: 'Book not found.' });
  }
});

// PUT /api/books/:id - Update a book
app.put('/api/books/:id', async (req, res) => {
  try {
    // Allow updating any field in the Book model
    const updateFields = {};
    const allowedFields = ['title', 'author', 'genres', 'pages', 'rating', 'reviews'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    }
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).json({ error: 'Book not found.' });
    res.status(200).json(book);
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(400).json({ error: 'Invalid data or book not found.', details: err.message });
  }
});

// DELETE /api/books/:id - Delete a book
app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found.' });
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: 'Book not found.' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal Server Error' });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});