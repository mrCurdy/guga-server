const jwt = require('jwt-simple');
const SECRET_KEY = process.env.JWT_SECRET;

exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const decoded = jwt.decode(token, SECRET_KEY);
    req.user = decoded; // Store user info in request object
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
