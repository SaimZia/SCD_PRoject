const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/paymentController');

router.post('/', paymentController.createOrUpdatePayment);
router.get('/', paymentController.getPayments);
router.get('/monthly', paymentController.getMonthlyPayments);
router.get('/:id', paymentController.getPaymentById);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
