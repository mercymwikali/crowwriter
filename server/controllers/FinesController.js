const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const CreateFine = asyncHandler(async (req, res) => {
  const { writerId, amount, description, orderId } = req.body;

  // Debug logging
  console.log("Request data:", { writerId, amount, description, orderId });

  try {
    // Ensure the order exists and is submitted
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status !== "SUBMITTED") {
      return res
        .status(400)
        .json({ error: "Fine can only be created for submitted orders" });
    }

    //ensure no duplicate fine
    const duplicateFine = await prisma.fine.findFirst({
      where: {
        order: { id: orderId },
        finedTo: { id: writerId },
      },
    });

    if (duplicateFine) {
      return res.status(400).json({ error: "Fine already exists" });
    }

    // Create the fine
    const fine = await prisma.fine.create({
      data: {
        order: {
          connect: { id: orderId },
        },
        finedTo: {
          connect: { id: writerId },
        },
        amount: parseInt(amount, 10), // Ensure amount is an integer
        reason: description,
      },
    });

    res.status(200).json({ message: "Fine created successfully", data: fine });
  } catch (error) {
    console.error("Error creating fine:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const editFine = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, reason } = req.body;

  try {
    const fine = await prisma.fine.update({
      where: { id: id },
      data: {
        amount: parseInt(amount, 10), // Ensure amount is an integer
        reason: reason,
      },
    });
    res.status(200).json({ message: "Fine updated successfully", data: fine });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getFines = asyncHandler(async (req, res) => {
  try {
    const fines = await prisma.fine.findMany({
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
        finedTo: {
          select: {
            id: true,
            username: true,
            email: true,
            active: true,
          },
        },
      },
    });
    res.status(200).json(fines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getFineById = asyncHandler(async (req, res) => {
  const { id } = req.params; // Assuming fineId is a URL parameter
  try {
    const fine = await prisma.fine.findUnique({
      where: { id: id },
      include: {
        order: {
          select: {
            topic: true,
            costPerPage: true,
            fullAmount: true,
            deadline: true,
            status: true,
          },
        },
        finedTo: {
          select: {
            username: true,
            email: true,
            active: true,
          },
        },
      },
    });
    res.status(200).json(fine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//fine by user id
const getFinesByUserId = asyncHandler(async (req, res) => {
  const { writerId } = req.params; // Assuming fineId is a URL parameter
  try {
    const fine = await prisma.fine.findMany({
      where: { finedTo: { id: writerId} },
      include: {
        order: {
          select: {
            orderId: true,
            topic: true,
            description: true,
            costPerPage: true,
            fullAmount: true,
            deadline: true,
            status: true,
          },
        },
        finedTo: {
          select: {
            username: true,
            email: true,
            active: true,
          },
        },
      },
    });
    res.status(200).json(fine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const deleteFine = asyncHandler(async (req, res) => {
  const { id } = req.params; // Assuming fineId is a URL parameter
  try {
    const fine = await prisma.fine.delete({
      where: { id: id },
    });
    res.status(200).json({ message: "Fine deleted successfully", data: fine });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  CreateFine,
  editFine,
  deleteFine,
  getFines,
  getFineById,
  getFinesByUserId,
};
