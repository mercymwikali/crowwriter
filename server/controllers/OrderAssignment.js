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

    res.status(201).json({ message: "Order assigned successfully", data: assignment });
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
        order: true,
        user: true,
      },
    });

    res.status(200).json(assignedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching assigned orders" });
  }
});

module.exports = {
  assignOrder,
  getAssignedOrders,
};
