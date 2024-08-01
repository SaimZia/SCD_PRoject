const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  traineeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainee',
    required: true
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
