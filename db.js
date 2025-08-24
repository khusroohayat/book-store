// db.js
// username: khusroohayat
// p/w: mSwm1PuPoaVv0iY6
const { MongoClient } = require('mongodb');

// Connection String (replace if your setup is different, e.g., Atlas)
// const connectionString = 'mongodb://localhost:27017/bookstore'; // As shown in video
// Example for MongoDB Atlas (replace with your actual connection string)
// const connectionString = 'mongodb+srv://<username>:<password>@<cluster-url>/bookstore?retryWrites=true&w=majority';

// Replace this with your *actual* MongoDB connection string
require('dotenv').config();
const connectionString = process.env.MONGODB_URI; // Now loaded from .env file

let dbConnection; // Variable to store the established connection

module.exports = {
  /**
   * Establishes a connection to the MongoDB database.
   * Takes a callback function which is executed after connection attempt.
   * The callback receives an error object (or null if successful).
   * @param {function} cb - Callback function (err) => {}
   */
  connectToDb: (cb) => {
    MongoClient.connect(connectionString)
      .then((client) => {
        console.log('Connected successfully to MongoDB');
        dbConnection = client.db(); // Get the database connection object
        return cb(); // Execute the callback with no error
      })
      .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        return cb(err); // Execute the callback with the error
      });
  },

  /**
   * Returns the established database connection object.
   * Make sure connectToDb has been called successfully before using this.
   * @returns {object} The MongoDB database connection object.
   */
  getDb: () => dbConnection,
};