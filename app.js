// Require Express
const express = require('express');
const { ObjectId } = require('mongodb'); // Import ObjectId
const { connectToDb, getDb } = require('./db'); // Import connect and get functions

// Init app & middleware (comment only in this stage)
const app = express();
app.use(express.json()); // Add JSON body parser middleware

// DB connection variable
let db;

// Connect to the database
connectToDb((err) => {
  // Check if there was an error connecting
  if (!err) {
    // If no error, start the express server
    app.listen(3000, () => {
      console.log('App listening on port 3000');
    });
    // Get the database connection object and store it
    db = getDb();
  } else {
    // Log error if connection failed - server won't start
    console.error('Database connection failed, server not starting:', err);
    // Optionally, you might want to exit the process if DB is critical
    // process.exit(1);
  }
});

// Routes (comment only in this stage)
app.get('/books', (req, res) => {
  // Initialize an array to hold the results
  let books = [];
  // Define how many books to return per page
  const booksPerPage = 3;
  // --- Pagination ---
  // Get the requested page number from query parameters (?p=0, ?p=1 etc.)
  // Use parseInt to ensure it's a number. Provide radix 10.
  // Default to 0 (the first page) if 'p' is not provided or is not a valid number.
  let page = parseInt(req.query.p, 10);
  if (isNaN(page) || page < 0) {
    page = 0; // Default to page 0 if query param is invalid or missing
  }

  // Use the db connection object to interact with the 'books' collection
  db.collection('books')
    .find() // Returns a Cursor - points to all documents
    .sort({ author: 1 }) // Sorts the documents by author ascending (modifies cursor)
    .skip(page * booksPerPage) // Calculate documents to skip based on page number and page size
    .limit(booksPerPage) // Limit the number of documents returned to the page size
    .forEach(book => books.push(book)) // Iterate cursor, fetch docs (in batches), add each to array
    .then(() => {
      // This runs after forEach has successfully processed all documents
      res.status(200).json(books); // Send success response with the books array
    })
    .catch((error) => {
      // This runs if any error occurred during find, sort, or forEach
      console.error("Error fetching books:", error); // Log the actual error
      res.status(500).json({ error: 'Could not fetch the documents' }); // Send error response
    });
});

// GET single book by ID
app.get('/books/:id', (req, res) => {
  // Check if the ID passed in the parameter is a valid ObjectId format
  if (ObjectId.isValid(req.params.id)) {
    // If valid, attempt to find the document
    db.collection('books')
      .findOne({ _id: new ObjectId(req.params.id) }) // Find by _id, converting string to ObjectId
      .then((doc) => {
        // If successful (doc might be null if not found)
        res.status(200).json(doc); // Send the document (or null) as JSON
      })
      .catch((err) => {
        // If a database error occurs during findOne
        console.error("DB Error:", err); // Log the actual error
        res.status(500).json({ error: 'Could not fetch the document' });
      });
  } else {
    // If the ID format is not valid
    res.status(500).json({ error: 'Not a valid doc id' }); // Send invalid ID error
    // Consider sending status 400 (Bad Request) instead of 500 here
  }
});

// POST route to create a new book
app.post('/books', (req, res) => {
  // Get the book data sent in the request body
  // The express.json() middleware makes this available
  const book = req.body;

  // Check if the db connection is established
  if (!db) {
      return res.status(503).json({ error: 'Database connection not established' });
  }

  // Insert the book document into the 'books' collection
  db.collection('books')
    .insertOne(book)
    .then(result => {
      // Send a success response back to the client
      // result contains info like acknowledged: true and the insertedId
      res.status(201).json(result); // 201 Created status code
    })
    .catch(err => {
      // Log the error on the server for debugging
      console.error('Error inserting document:', err);
      // Send an error response back to the client
      res.status(500).json({ error: 'Could not create a new document' });
    });
});

// DELETE a book by ID
app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;

  // Check if the provided ID is a valid MongoDB ObjectId
  if (ObjectId.isValid(bookId)) {
    db.collection('books')
      .deleteOne({ _id: new ObjectId(bookId) }) // Delete by the BSON ObjectId
      .then((result) => {
        // result contains info like acknowledged: true, deletedCount: 1 (or 0 if not found)
        if (result.deletedCount === 1) {
            res.status(200).json(result); // Send the result on successful deletion
        } else {
             res.status(404).json({ error: 'Document not found, could not delete' }); // Send 404 if nothing was deleted
        }
      })
      .catch((err) => {
        console.error('Error deleting document:', err);
        res.status(500).json({ error: 'Could not delete the document' });
      });
  } else {
    // If the ID format is invalid
    res.status(500).json({ error: 'Not a valid doc id' });
  }
});

// --- PATCH Route Handler ---
app.patch(`/books/:id`, async (req, res) => {
  const { id } = req.params; // Get the book ID from the URL parameter
  const updates = req.body; // Get the update data from the request body

  // Basic validation
  if (!db) {
    return res.status(503).json({ error: "Database connection not established" });
  }
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid book ID format" });
  }
   if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Request body cannot be empty for update" });
   }
   // Ensure _id is not part of the update payload (users shouldn't change the ID)
   if (updates._id) {
     delete updates._id;
   }

  try {
    const collection = db.collection('books');
    const filter = { _id: new ObjectId(id) }; // Filter by the document's _id

    // Use the $set operator to update only the fields provided in the body
    const updateDoc = {
      $set: updates,
    };

    const result = await collection.updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      // No document found with that ID
      return res.status(404).json({ error: "Book not found with the specified ID" });
    }

    if (result.modifiedCount === 0 && result.matchedCount === 1) {
        // Document found but no changes applied (perhaps same data was sent)
        return res.status(200).json({ message: "Book found, but no changes were applied (data might be the same)", result });
    }

    // Successfully updated
    console.log(`Successfully updated book with ID: ${id}`);
    res.status(200).json({ message: "Book updated successfully", result }); // Send back MongoDB result

  } catch (err) {
    console.error(`Error updating book with ID: ${id}`, err);
    res.status(500).json({ error: "Could not update the book" });
  }
});