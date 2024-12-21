// src/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Route to register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists.' });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = await User.create({ username, password: hashedPassword });

  res.status(201).json({ message: 'User created successfully.' });
});

module.exports = router;
