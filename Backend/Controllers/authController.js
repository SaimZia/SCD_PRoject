const jwt = require('jsonwebtoken');
const User = require('../Models/Users');
const Admin = require('../Models/adminModel');
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && user.password === password) {
      const token = jwt.sign({ username: user.username }, JWT_SECRET);
      return res.json({ token });
    }
    const admin = await Admin.findOne({ empId: username });
    if (admin && admin.password === password) {
      const token = jwt.sign({ empId: admin.empId }, JWT_SECRET);
      return res.json({ token });
    }
    return res.status(401).json({ error: 'Invalid username or password' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await Admin.findOne({ empId: req.user.empId }).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).send('Server error');
  }
};

