const express = require('express');
const router = express.Router();
const packageController = require('../Controllers/packageController');

router.get('/', packageController.getAllPackages);
router.get('/:id', packageController.getPackageById);
router.post('/', packageController.createPackage);
router.put('/:id', packageController.updatePackage);
router.delete('/:id', packageController.deletePackage);

module.exports = router;
