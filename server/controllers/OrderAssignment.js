const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Assign an order to a user
const assignOrder = asyncHandler(async (req, res) => {
  try {
    const { orderId, userId } = req.body;

    // Check if the order exists
    const orderExists = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!orderExists) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if the order is already assigned
    if (orderExists.status === "ASSIGNED") {
      return res.status(400).json({ error: "Order already assigned" });
    }

    // Check if the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create assignment
    const assignment = await prisma.assignment.create({
      data: {
        orderId: orderId,
        userId: userId,
      },
    });

    // Update order status to ASSIGNED
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "ASSIGNED" },
    });

    res
      .status(201)
      .json({
        message: `Order assigned successfully to ${userExists.username}`,
        data: assignment,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error assigning order" });
  }
});

// Fetch all assigned orders
const getAssignedOrders = asyncHandler(async (req, res) => {
  try {
    const assignedOrders = await prisma.assignment.findMany({
      include: {
        order: {
          select: {
            id: true,
            orderId: true,
            topic: true,
            costPerPage: true,
            fullAmount: true,
            deadline: true,
            remainingTime: true,
            status: true,
          },
        },
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json(assignedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching assigned orders" });
  }
});

//get assigned orders with writer id
//get assigned orders with writer id
const getAssignedOrdersWithWriterId = asyncHandler(async (req, res) => {
  try {
    const writerId = req.params.writerId;
    const assignedOrders = await prisma.assignment.findMany({
      where: {
        userId: writerId,
      },
      include: {
        order: {
          select: {
            id: true,
            orderId: true,
            topic: true,
            costPerPage: true,
            fullAmount: true,
            deadline: true,
            remainingTime: true,
            status: true,
          },
        },
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });
    
    res.status(200).json(assignedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching assigned orders for the writer" });
  }
});


module.exports = {
  assignOrder,
  getAssignedOrders,
  getAssignedOrdersWithWriterId,
};
