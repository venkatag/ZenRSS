const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;
const SECRET_KEY = 'your-secret-key'; // Replace with your own secret key

// Connect to MongoDB
mongoose.connect('mongodb://localhost/zenrss', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Create a schema for the read feed items
const readItemSchema = new mongoose.Schema({
  title: String,
  link: String,
});
const ReadItem = mongoose.model('ReadItem', readItemSchema);

// Create a schema for the users
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(express.json());
app.use(helmet());
app.use(express.static('public'));

// Endpoint to register a new user
app.post(
  '/register',
  [
    body('username').notEmpty().trim(),
    body('password').notEmpty().trim(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Check if the user already exists
    User.findOne({ username }, (err, existingUser) => {
      if (err) {
        console.error('Error finding user:', err);
        return res.sendStatus(500);
      }

      if (existingUser) {
        return res.status(409).json({ error: 'Username already exists' });
      }

      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.sendStatus(500);
        }

        const user = new User({ username, password: hashedPassword });
        user.save((err) => {
          if (err) {
            console.error('Error saving user:', err);
            return res.sendStatus(500);
          }

          res.sendStatus(201);
        });
      });
    });
  }
);

// Endpoint to authenticate a user and obtain a JWT
app.post(
  '/login',
  [
    body('username').notEmpty().trim(),
    body('password').notEmpty().trim(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Find the user
    User.findOne({ username }, (err, user) => {
      if (err) {
        console.error('Error finding user:', err);
        return res.sendStatus(500);
      }

      if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
      }

      // Compare the passwords
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.sendStatus(500);
        }

        if (!result) {
          return res.status(401).json({ error: 'Authentication failed' });
        }

        // Generate a JWT
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
      });
    });
  }
);

// Authentication middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Error verifying JWT:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = decoded.username;
    next();
  });
}

// Endpoint to mark a feed item as read
app.post(
  '/mark-read',
  [
    body('title').notEmpty().trim(),
    body('link').notEmpty().trim().isURL(),
  ],
  authenticate,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, link } = req.body;

    const readItem = new ReadItem({ title, link });
    readItem.save((err) => {
      if (err) {
        console.error('Error saving read item:', err);
        return res.sendStatus(500);
      }
      console.log(`Marked as read: ${title}`);
      res.sendStatus(200);
    });
  }
);

// Endpoint to retrieve the list of read feed items
app.get('/read-items', authenticate, (req, res) => {
  ReadItem.find({}, (err, items) => {
    if (err) {
      console.error('Error retrieving read items:', err);
      return res.sendStatus(500);
    }
    res.json(items);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.sendStatus(500);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});