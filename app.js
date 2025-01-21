const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());

// Fetch server name from environment variables
const serverName = process.env.SERVER_NAME || "undefined";

// Initialize SQLite Database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    // Create Users Table if not exists
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      )`,
      (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
        }
      }
    );
  }
});

// Routes
app.get('/', (req, res) => {
  res.send(`Hi! This is the test server - ${serverName}`);
});

// Add a user to the database
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const query = `INSERT INTO users (name, email) VALUES (?, ?)`;
  db.run(query, [name, email], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to add user.', details: err.message });
    }
    res.status(201).json({ id: this.lastID, name, email });
  });
});

// Fetch all users from the database
app.get('/users', (req, res) => {
  const query = `SELECT * FROM users`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users.', details: err.message });
    }
    res.status(200).json({ users: rows });
  });
});

// Fetch a specific user by ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM users WHERE id = ?`;
  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch user.', details: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(row);
  });
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM users WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete user.', details: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json({ message: 'User deleted successfully.' });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
