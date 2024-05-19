const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordersController');
const assignedOrdersController = require('../controllers/OrderAssignment');
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
router.get("/my-jobs/:writerId", assignedOrdersController.getAssignedOrdersWithWriterId);

router.post("/assign-order", assignedOrdersController.assignOrder);
router.delete("/delete-assigned-orders", assignedOrdersController.deleteAssignedOrders); // Add the route for deleting assigned orders

module.exports = router;
