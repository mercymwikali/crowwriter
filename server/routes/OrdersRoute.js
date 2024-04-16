// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController= require('../controllers/ordersController');
// const verifyJwt = require('../middleware/verifyJwt');

// router.use(verifyJwt)


router.route('/get-writers-orders').get(orderController.getAllOrder)
router.route('/get-all-orders').get(orderController.getAllOrdersWithoutDetails)
router.post('/create-order', orderController.createOrder)
router.patch('/update-order/:id', orderController.updateOrder)
router.delete('/delete-order/:id', orderController.deleteOrder)

module.exports = router