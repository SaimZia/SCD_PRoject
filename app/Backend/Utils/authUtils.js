const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';
exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};
exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};