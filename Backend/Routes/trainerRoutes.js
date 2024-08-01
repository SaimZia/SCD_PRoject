const express = require('express');
const { getAllTrainers, createTrainer, updateTrainer, deleteTrainer, getTrainersCountByCity } = require('../Controllers/trainerController');
const router = express.Router();
router.get('/', getAllTrainers);
router.post('/', createTrainer);
router.put('/:id', updateTrainer);
router.delete('/:id', deleteTrainer);
router.get('/city-count', getTrainersCountByCity);

module.exports = router;