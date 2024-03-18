const jwt = require('jsonwebtoken');
const User = require('../models/user_model');

const verifyToken = (req, res, next) => {

  const authHeader = req.headers.authorization;
  if (authHeader) {

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token is not valid' });
      }

      req.user = await User.findByPk(decoded.userId);
      if (!req.user) {
        return res.status(403).json({ message: 'User not found' });
      }

      next();
    });
  } else {
    res.status(401).json({ message: 'Authorization header is missing' });
  }
};

module.exports = verifyToken;