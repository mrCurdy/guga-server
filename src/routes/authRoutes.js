// src/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import your User model
const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { username: email } }); // Assuming 'username' stores email
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Respond with success (or token for authentication)
    res.status(200).json({ message: 'Login successful!' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

// Route to register a new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
  // Check if user already exists
  const existingUser = await User.findOne({ where: { username: email } });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists.' });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = await User.create({ 
    username: email, 
    password: hashedPassword 
  });

  res.status(201).json({ message: 'User created successfully.' });

} catch (err) {
  console.error('Error registering user:', err);
  res.status(500).json({ error: 'An error occurred. Please try again.' });
}
});

module.exports = router;
