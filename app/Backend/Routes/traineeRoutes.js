const express = require('express');
const router = express.Router();
const traineeController = require('../Controllers/traineeController');
router.post('/', traineeController.createTrainee);
router.put('/:id', traineeController.updateTrainee);
router.delete('/:id', traineeController.deleteTrainee);
router.get('/', traineeController.getAllTrainees);
router.get('/city-count', traineeController.getTraineesCountByCity);
module.exports = router;