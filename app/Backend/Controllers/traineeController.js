const Trainee = require('../Models/traineeModel');

exports.createTrainee = async (req, res) => {
  try {
    const traineeData = req.body;
    const trainee = new Trainee(traineeData);
    await trainee.save();
    res.status(201).json(trainee);
  } catch (error) {
    res.status(500).json({ message: 'Error creating trainee', error });
  }
};

exports.updateTrainee = async (req, res) => {
  try {
    const traineeData = req.body;
    const trainee = await Trainee.findByIdAndUpdate(req.params.id, traineeData, { new: true });
    if (!trainee) {
      return res.status(404).json({ message: 'Trainee not found' });
    }
    res.json(trainee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating trainee', error });
  }
};

exports.deleteTrainee = async (req, res) => {
  try {
    const trainee = await Trainee.findByIdAndDelete(req.params.id);
    if (!trainee) {
      return res.status(404).json({ message: 'Trainee not found' });
    }
    res.json({ message: 'Trainee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting trainee', error });
  }
};

exports.getAllTrainees = async (req, res) => {
  try {
    const trainees = await Trainee.find();
    res.json(trainees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainees', error });
  }
};

exports.getTraineesCountByCity = async (req, res) => {
  try {
    const traineesCountByCity = await Trainee.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $project: { _id: 0, city: '$_id', count: 1 } },
    ]);
    res.json(traineesCountByCity);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
