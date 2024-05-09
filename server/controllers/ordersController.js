const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const { OrderStatus } = require("@prisma/client");

// Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      // where: { status: { not: "deleted" } },
      // orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderId: true,
        topic: true,
        discipline: true,
        service: true,
        description: true,
        format: true,
        noOfPages: true,
        costPerPage: true,
        fullAmount: true,
        deadline: true,
        remainingTime: true,
        status: true,
      }
    });

    //if no orders  return 404 status error
    if (!orders) {
      return res.status(404).json({ error: "No orders found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving orders" });
  }
});

// Create an order
const createOrder = asyncHandler(async (req, res) => {
  try {
    const newOrder = req.body;

    // Check for required fields
    const {
      orderId,
      topic,
      discipline,
      service,
      format,
      noOfPages,
      costPerPage,
      fullAmount,
      deadline,
      remainingTime,
      status,
      assignedWriterId // New field: Assigned writer ID
    } = newOrder;

    if (
      !orderId ||
      !topic ||
      !discipline ||
      !service ||
      !format ||
      !noOfPages ||
      !costPerPage ||
      !fullAmount ||
      !deadline ||
      !remainingTime
    ) {
      return res
        .status(400)
        .json({ error: "Please fill in all required fields" });
    }

    // Check if the assigned writer exists
    const assignedWriter = await prisma.user.findUnique({
      where: { id: assignedWriterId },
    });

    if (!assignedWriter || assignedWriter.role !== "writer") {
      return res.status(404).json({ error: "Assigned writer not found" });
    }

    // Create new order
    const createdOrder = await prisma.order.create({
      data: {
        ...newOrder,
        writer: { connect: { id: assignedWriterId } }, // Connect the order to the assigned writer
      },
    });

    res
      .status(201)
      .json({ message: "Order created successfully", data: createdOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating order" });
  }
});

// Update an order
const updateOrder = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.id;
    //check if the order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...req.body,
      },
    });
    if (updatedOrder) {
      return res
        .status(200)
        .json({ message: "Order updated successfully", data: updatedOrder });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating order" });
  }
});

// Delete an order
const deleteOrder = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.id;

    // Check if the order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    // If no order found, return 404 status error
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // If the order is assigned, return an error message
    if (existingOrder.status === "assigned") {
      return res.status(400).json({ error: "Cannot delete assigned order" });
    }

    // Check if a reason is provided for deleting the order
    const { reason } = req.body;
    if (!reason) {
      return res
        .status(400)
        .json({ error: "Please provide a reason for deleting the order" });
    }

    // Update the notification table with the reason
    const newNotification = await prisma.notification.create({
      data: {
        type: "INFO",
        message: `Order with ID ${existingOrder.orderId} has been deleted by manager. Reason: ${reason}`,
        recipientId: existingOrder.assignedToId, // Assuming there's a field for the user who was assigned the order
      },
    });

    // Delete the order
    await prisma.order.delete({ where: { id: parseInt(id) } });

    res.status(200).json({
      message: "Order deleted successfully",
      notification: newNotification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting order" });
  }
});

//import the orderstatus enum values from the prisma schema

//get the orderstatus enum values from the database
//get the orderstatus enum values from the database
const statuses = asyncHandler(async (req, res) => {
  try {
    // Get all values of the OrderStatus enum
    const orderStatuses = Object.values(OrderStatus);
    res.json(orderStatuses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving order statuses" });
  }
});


module.exports = {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  statuses,
};
