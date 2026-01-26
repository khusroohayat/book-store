// book-ownership.test.js
// Tests for user data isolation and book ownership enforcement


process.env.MONGODB_URI = 'mongodb://admin:qwerty@localhost:27017/bookstore_test?authSource=admin';
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Book = require('../models/Book');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

let user1, user2, token1, token2, book1, book2;

describe('Book Ownership & Data Isolation', () => {
  beforeAll(async () => {
    await User.deleteMany({});
    await Book.deleteMany({});
    user1 = await User.create({ username: 'user1', password: 'pass1' });
    user2 = await User.create({ username: 'user2', password: 'pass2' });
    token1 = jwt.sign({ id: user1._id }, JWT_SECRET);
    token2 = jwt.sign({ id: user2._id }, JWT_SECRET);
    book1 = await Book.create({ title: 'Book1', author: 'A', genres: ['Fiction'], pages: 100, rating: 5, reviews: [], userId: user1._id });
    book2 = await Book.create({ title: 'Book2', author: 'B', genres: ['Nonfiction'], pages: 200, rating: 4, reviews: [], userId: user2._id });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('User only sees their own books', async () => {
    const res = await request(app)
      .get('/api/books')
      .set('Authorization', `Bearer ${token1}`);
    expect(res.status).toBe(200);
    expect(res.body.books.length).toBe(1);
    expect(res.body.books[0].userId).toBe(user1._id.toString());
  });

  test('User cannot access another user\'s book', async () => {
    const res = await request(app)
      .get(`/api/books/${book2._id}`)
      .set('Authorization', `Bearer ${token1}`);
    expect(res.status).toBe(403);
  });

  test('User cannot update another user\'s book', async () => {
    const res = await request(app)
      .put(`/api/books/${book2._id}`)
      .set('Authorization', `Bearer ${token1}`)
      .send({ title: 'Hacked' });
    expect(res.status).toBe(403);
  });

  test('User cannot delete another user\'s book', async () => {
    const res = await request(app)
      .delete(`/api/books/${book2._id}`)
      .set('Authorization', `Bearer ${token1}`);
    expect(res.status).toBe(403);
  });

  test('User can access, update, and delete their own book', async () => {
    let res = await request(app)
      .get(`/api/books/${book1._id}`)
      .set('Authorization', `Bearer ${token1}`);
    expect(res.status).toBe(200);
    res = await request(app)
      .put(`/api/books/${book1._id}`)
      .set('Authorization', `Bearer ${token1}`)
      .send({ title: 'Updated Title' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
    res = await request(app)
      .delete(`/api/books/${book1._id}`)
      .set('Authorization', `Bearer ${token1}`);
    expect(res.status).toBe(204);
  });
});
