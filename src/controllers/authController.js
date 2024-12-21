const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const User = require('../models/user'); // Assuming you have a user model

const SECRET_KEY = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const payload = { id: user.id, username: user.username };
  const token = jwt.encode(payload, SECRET_KEY);

  res.json({ message: 'Login successful', token });
};
