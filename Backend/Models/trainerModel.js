const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  trainerID: { type: String, required: true },
  name: { type: String, required: true },
  cnic: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  city: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;
