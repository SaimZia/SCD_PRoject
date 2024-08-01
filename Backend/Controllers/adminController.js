const Admin = require('../Models/adminModel');

exports.createAdmin = async (req, res) => {
  try {
    const { adminName, empId, city, password } = req.body;
    const newAdmin = new Admin({
      adminName,
      empId,
      city,
      password
    });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminName, empId, city, password } = req.body;
    const updatedAdmin = await Admin.findByIdAndUpdate(id, { adminName, empId, city, password }, { new: true });
    res.json(updatedAdmin);
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAdminsCountByCity = async (req, res) => {
  try {
    const adminsCountByCity = await Admin.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $project: { _id: 0, city: '$_id', count: 1 } },
    ]);
    res.json(adminsCountByCity);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
