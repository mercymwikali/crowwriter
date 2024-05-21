const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

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

    // Check if the order is submitted
    if (orderExists.status === "SUBMITTED") {
      return res.status(400).json({ error: "Order already submitted" });
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
      where: {
order: { status: { not: "SUBMITTED" } },
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

    if (!assignedOrders) {
      return res.status(404).json({ error: "No assigned orders found" });
    }




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
        order: { status:"ASSIGNED" },
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

    if (!assignedOrders) {
      return res.status(404).json({ error: "No assigned orders found for the writer" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching assigned orders for the writer" });
  }
});


const deleteAssignedOrders = asyncHandler(async (req, res) => {
  try {
    // Fetch all assigned orders along with their associated orders
    const assignedOrders = await prisma.assignment.findMany({
      include: {
        order: true,
      },
    });

    if (!assignedOrders || assignedOrders.length === 0) {
      return res.status(404).json({ message: "No assigned orders found" });
    }

    // Iterate through assigned orders
    for (const assignedOrder of assignedOrders) {
      const order = assignedOrder.order;
      const documentId = order.documentId;

      // Check if documentId exists and if the order has an associated document
      if (documentId) {
        // Delete attachments if they exist
        const filePath = path.join(__dirname, `../uploads/documents/${documentId}`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted attachment for order ${order.orderId}`);
        }
      }

      // Delete assigned orders
      await prisma.assignment.deleteMany({
        where: { id: assignedOrder.id },
      });

      // Optionally, reset the order status back to default or any other appropriate status
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PENDING' },
      });

      console.log(`Deleted assigned order ${order.orderId}`);
    }

    // Send success message
    res.status(200).json({ message: "All assigned orders and their attachments deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting assigned orders and their attachments" });
  }
});



module.exports = {
  assignOrder,
  getAssignedOrders,
  getAssignedOrdersWithWriterId,
  deleteAssignedOrders
};
