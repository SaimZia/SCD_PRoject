const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
router.post('/', adminController.createAdmin);
router.get('/', adminController.getAdmins);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);
router.get('/city-count', adminController.getAdminsCountByCity);

module.exports = router;