const express = require('express');
const router = express.Router();
const paymentRequestController = require('../controllers/Payments');

// Route to handle payment request
router.post('/request-payment', paymentRequestController.requestPayment);

// Route to fetch payment requests by user ID
router.get('/payment-requests/:userId', paymentRequestController.getPaymentRequestsByUserId);

// Route to edit a payment request
router.put('/payment-requests/:requestId', paymentRequestController.editPaymentRequest);

// Route to delete a payment request
router.delete('/payment-requests/:requestId', paymentRequestController.deletePaymentRequest);

module.exports = router;
