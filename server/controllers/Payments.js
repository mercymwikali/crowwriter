// paymentRequestController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to handle payment request
const requestPayment = async (req, res) => {
  try {
    const { invoiceItems, totalAmount, userId } = req.body;

    // Create payment request
    const paymentRequest = await prisma.paymentRequest.create({
      data: {
        amount: totalAmount,
        requestedById: userId,
        paymentStatus: 'PENDING' // Set payment status to pending initially
      }
    });

    // Create payment request items
    for (const item of invoiceItems) {
      await prisma.paymentRequestItem.create({
        data: {
          orderId: item.OrderId,
          paymentRequestId: paymentRequest.id
        }
      });
    }

    res.status(201).json({ message: 'Payment request created successfully' });
  } catch (error) {
    console.error('Error requesting payment:', error);
    res.status(500).json({ error: 'Failed to request payment' });
  }
};

// Function to fetch payment requests by user ID
const getPaymentRequestsByUserId = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const paymentRequests = await prisma.paymentRequest.findMany({
        where: {
          requestedById: userId
        }
      });
  
      res.status(200).json(paymentRequests);
    } catch (error) {
      console.error('Error fetching payment requests:', error);
      res.status(500).json({ error: 'Failed to fetch payment requests' });
    }
  };
  
  // Function to edit a payment request
  const editPaymentRequest = async (req, res) => {
    try {
      const { requestId } = req.params;
      const { amount } = req.body;
  
      const updatedPaymentRequest = await prisma.paymentRequest.update({
        where: {
          id: requestId
        },
        data: {
          amount: amount
        }
      });
  
      res.status(200).json(updatedPaymentRequest);
    } catch (error) {
      console.error('Error editing payment request:', error);
      res.status(500).json({ error: 'Failed to edit payment request' });
    }
  };
  
  // Function to delete a payment request
  const deletePaymentRequest = async (req, res) => {
    try {
      const { requestId } = req.params;
  
      await prisma.paymentRequest.delete({
        where: {
          id: requestId
        }
      });
  
      res.status(200).json({ message: 'Payment request deleted successfully' });
    } catch (error) {
      console.error('Error deleting payment request:', error);
      res.status(500).json({ error: 'Failed to delete payment request' });
    }
  };
  
  module.exports = { 
    requestPayment,
    getPaymentRequestsByUserId,
    editPaymentRequest,
    deletePaymentRequest
  };