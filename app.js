require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const Book = require('./models/Book');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
}
// POST /api/register - Register new user
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required.' });
    }
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: 'Username already exists.' });
    }
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error.', details: err.message });
  }
});

// POST /api/login - Login user
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required.' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/logout - Dummy endpoint (client should delete token)
app.post('/api/logout', (req, res) => {
  res.json({ message: 'Logged out.' });
});


app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// POST /api/books - Add a new book (protected)
app.post('/api/books', authenticateToken, async (req, res) => {
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

// GET /api/books - List all books (protected, with pagination)
app.get('/api/books', authenticateToken, async (req, res) => {
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

// GET /api/books/:id - Get single book (protected)
app.get('/api/books/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found.' });
    res.status(200).json(book);
  } catch (err) {
    res.status(404).json({ error: 'Book not found.' });
  }
});

// PUT /api/books/:id - Update a book (protected)
app.put('/api/books/:id', authenticateToken, async (req, res) => {
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

// DELETE /api/books/:id - Delete a book (protected)
app.delete('/api/books/:id', authenticateToken, async (req, res) => {
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