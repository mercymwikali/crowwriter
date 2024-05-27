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

    res.status(201).json({
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
const getAssignedOrdersWithWriterId = asyncHandler(async (req, res) => {
  try {
    const writerId = req.params.writerId;
    const assignedOrders = await prisma.assignment.findMany({
      where: {
        userId: writerId,
        order: { status: "ASSIGNED" },
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
      return res
        .status(404)
        .json({ error: "No assigned orders found for the writer" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error fetching assigned orders for the writer" });
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

      // Check if the order is not submitted
      if (order.status !== "SUBMITTED") {
        const documentId = order.documentId;

        // Check if documentId exists and if the order has an associated document
        if (documentId) {
          // Delete attachments if they exist
          const filePath = path.join(
            __dirname,
            `../uploads/documents/${documentId}`
          );
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted attachment for order ${order.orderId}`);
          }
        }

        // Delete the assigned order
        await prisma.assignment.deleteMany({
          where: { id: assignedOrder.id },
        });

        // Optionally, reset the order status back to default or any other appropriate status
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "PENDING" },
        });

        console.log(`Deleted assigned order ${order.orderId}`);
      }
    }

    // Send success message
    res.status(200).json({
      message: "All non-submitted assigned orders and their attachments deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error deleting assigned orders and their attachments" });
  }
});


// Reassign order and delete from initially assigned writer then create a notification that will inform both writers of changes made
const reassignOrder = asyncHandler(async (req, res) => {
  try {
    const { orderId, userId } = req.body;
    if (!orderId || !userId) {
      return res.status(400).json({ message: "Order ID and writer ID are required" });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const newWriter = await prisma.user.findUnique({ where: { id: userId } });
    if (!newWriter) {
      return res.status(404).json({ message: "New writer not found" });
    }

    // Find the current assignment to get the old writer's userId
    const currentAssignment = await prisma.assignment.findFirst({
      where: { orderId: orderId },
      select: { userId: true }
    });

    if (!currentAssignment) {
      return res.status(404).json({ message: "Current assignment not found" });
    }

    const oldWriterId = currentAssignment.userId;

    // Delete the assignment from the original writer
    await prisma.assignment.deleteMany({
      where: {
        orderId: orderId,
        userId: oldWriterId // Ensure writerId is the original writer's ID
      }
    });

    // Create an assignment for the new writer
    const assignment = await prisma.assignment.create({
      data: {
        orderId: orderId,
        userId: userId
      }
    });

    if (!assignment) {
      return res.status(500).json({ message: "Error reassigning order" });
    }

    // Update the order status to "ASSIGNED"
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "ASSIGNED" }
    });

    // Create notifications for both the new writer and the original writer
    await prisma.notification.createMany({
      data: [
        {
          type: "INFO", // Set type to INFO
          recipientId: userId, // Set recipientId to new writer's ID
          message: "An order has been reassigned" // Notification for the new writer
        },
        {
          type: "INFO", // Set type to INFO
          recipientId: oldWriterId, // Set recipientId to original writer's ID
          message: "Your order has been reassigned" // Notification for the original writer
        }
      ]
    });

    // Fetch the created notifications
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: {
          in: [userId, oldWriterId]
        }
      },
      select: {
        id: true,
        type: true,
        recipientId: true,
        message: true,
        createdAt: true
      }
    });
    ;

    res.status(200).json({ message: "Order reassigned successfully", notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error reassigning order" });
  }
});





module.exports = {
  assignOrder,
  getAssignedOrders,
  getAssignedOrdersWithWriterId,
  deleteAssignedOrders,
  reassignOrder,
};
