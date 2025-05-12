const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
  adminName: { type: String, required: true },
  empId: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
},{ collection: 'admins' });
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;