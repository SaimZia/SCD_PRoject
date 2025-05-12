const mongoose = require('mongoose');

const traineeSchema = new mongoose.Schema({
  traineeID: { type: String, required: true },
  name: { type: String, required: true },
  cnic: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  city: { type: String, required: true },
  status: { type: String, required: true },
  packageName: { type: String, required: false },
});

module.exports = mongoose.model('Trainee', traineeSchema);
