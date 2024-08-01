const mongoose = require('mongoose');
const Payment = require('../Models/paymentModel');

exports.createOrUpdatePayment = async (req, res) => {
  const { traineeId, packageId, amount, status, date } = req.body;

  if (!traineeId || !packageId || !status) {
    return res.status(400).json({ message: 'Trainee ID, Package ID, and Status are required.' });
  }

  try {
    const payment = new Payment({
      traineeId,
      packageId,
      amount,
      status,
      date: new Date(date)
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    console.error('Error saving payment record:', error);
    res.status(500).json({ message: 'Error saving payment record', error });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('traineeId packageId');
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getPaymentById = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid ID format');
  }

  try {
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).send('Payment not found');
    }
    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).send('Internal server error');
  }
};

exports.deletePayment = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment record deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMonthlyPayments = async (req, res) => {
  try {
    const monthlyPayments = await Payment.aggregate([
      { $group: { _id: { $month: '$date' }, amount: { $sum: '$amount' } } },
      { $project: { _id: 0, month: '$_id', amount: 1 } },
      { $sort: { month: 1 } },
    ]);
    res.json(monthlyPayments);
  } catch (error) {
    console.error('Error in getMonthlyPayments:', error);
    res.status(500).json({ error: 'Server error' });
  }
};