const Trainer = require('../Models/trainerModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTrainer = async (req, res) => {
  const { trainerID, name, cnic, phoneNumber, emailAddress, city, status } = req.body;
  try {
    const newTrainer = new Trainer({ trainerID, name, cnic, phoneNumber, emailAddress, city, status });
    await newTrainer.save();
    res.status(201).json({ message: 'Trainer created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTrainer = async (req, res) => {
  const { id } = req.params;
  const { trainerID, name, cnic, phoneNumber, emailAddress, city, status } = req.body;
  try {
    await Trainer.findByIdAndUpdate(id, { trainerID, name, cnic, phoneNumber, emailAddress, city, status });
    res.json({ message: 'Trainer updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTrainer = async (req, res) => {
  const { id } = req.params;
  try {
    await Trainer.findByIdAndDelete(id);
    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTrainersCountByCity = async (req, res) => {
  try {
    const trainersCountByCity = await Trainer.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $project: { _id: 0, city: '$_id', count: 1 } },
    ]);
    res.json(trainersCountByCity);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};