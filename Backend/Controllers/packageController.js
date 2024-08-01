const Package = require('../Models/packageModel');

exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPackageById = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json(package);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPackage = async (req, res) => {
  const { name, description, price } = req.body;

  try {
    const newPackage = new Package({ name, description, price });
    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePackage = async (req, res) => {
  const { name, description, price } = req.body;

  try {
    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      { name, description, price },
      { new: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);
    if (!deletedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
