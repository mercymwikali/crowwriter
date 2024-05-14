const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordersController')
const assignedOrdersController = require('../controllers/OrderAssignment')
const { verifyJwt } = require('../middleware/verifyJwt'); // Import the verifyJwt middleware function

// Apply verifyJwt middleware to protected routes
// router.use(verifyJwt);


router.route('/get-writers-orders').get(orderController.getAllOrders);
// router.route('/get-all-orders').get(orderController.getAllOrdersWithoutDetails);
router.post('/create-order', orderController.createOrder);
router.patch('/update-order/:id', orderController.updateOrder);
router.delete('/delete-order/:id', orderController.deleteOrder);
router.get('/order-Status', orderController.statuses);
router.get("/assigned-Orders-list", assignedOrdersController.getAssignedOrders)
router.get("/writer-assigned-orders/:writerId", orderController.getWriterAssignedOrders);



router.post("/assign-order", assignedOrdersController.assignOrder);

module.exports = router;
