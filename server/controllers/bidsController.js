const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// @desc    Create a new bid
// @route   POST /api/bids
// @access  Private (only accessible to authenticated users)
const createBid = asyncHandler(async (req, res) => {
  const { orderId, writerId } = req.body;

  if (!orderId || !writerId) {
    return res.status(400).json({ message: "Order ID and writer ID are required" });
  }

  try {
    // Check if the order and writer exist
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    const writer = await prisma.user.findUnique({
      where: { id: writerId },
      select: {
        id: true,
      }
    });

    if (!order || !writer) {
      return res.status(404).json({ message: "Order or writer not found" });
    }

    // Check if there's a duplicate bid
    const duplicateBid = await prisma.bid.findFirst({
      where: {
        orderId: orderId,
        writerId: writerId
      }
    });

    if (duplicateBid) {
      return res.status(409).json({ message: "You have already placed a bid for this order" });
    }

    // Create the bid
    const bid = await prisma.bid.create({
      data: {
        order: { connect: { id: orderId } },
        writer: { connect: { id: writerId } },
        status: "PENDING", // Default status
      },
    });

    // Update the order status to "PENDING" when a bid is created
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PENDING" }
    });

    res.status(201).json({ message: "Bid created successfully", data: bid });
  } catch (error) {
    console.error("Error creating bid:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get all bids for a particular order
// @route   GET /api/bids/:orderId
// @access  Private (only accessible to authenticated users)
const getAllBidsForOrder = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve all bids for the specified order excluding the "assigned" status
    const bids = await prisma.bid.findMany({
      where: {
        orderId: id, // Filter bids based on orderId
        status: { not: "ASSIGNED" }, // Exclude "assigned" status
      },
      include: {
        order: {
          select: {
            id: true,
            orderId: true,
            topic: true,
            costPerPage: true,
            deadline: true,
            remainingTime: true,
            status: true,
            fullAmount: true,
          },
        },
        writer: {
          select: {
            id: true,
            username: true,
            email: true,
            active: true,
          },
        },
      },
    });

    // Check if any bids were found for the specified order
    if (!bids || bids.length === 0) {
      return res.status(404).json({ message: "Bids not found for the specified order" });
    }

    // Return the list of bids for the specified order
    res.json(bids);
  } catch (error) {
    console.error("Error getting bids for order:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// @desc    Get all bids with counts and writers
// @route   GET /api/bids
// @access  Private (only accessible to authenticated users)
const getAllBidsWithCountsAndWriters = asyncHandler(async (req, res) => {
  try {
    const bids = await prisma.bid.findMany({
      where: {
       order: {
        status: "PENDING"
       } 
      },
      include: {
        order: {
          select: {
            id: true,
            orderId: true,
            topic: true,
            costPerPage: true,
            deadline: true,
            remainingTime: true,
            status: true,
            fullAmount: true,
          },
        },
        writer: {
          select: {
            id: true,
            username: true,
            email: true,
            active: true,
          },
        },
      },
    });

    // If there are no bids, return an empty array with a message
    if (!bids || bids.length === 0) {
      return res.status(404).json({ message: "No bids found" });
    }

    // Initialize an object to store unique orders with their bid counts and writers
    const uniqueOrders = {};

    // Iterate over all bids to count bids for each order and track writers
    bids.forEach(bid => {
      const orderId = bid.order.id;
      // Check if the order already exists in uniqueOrders
      if (orderId in uniqueOrders) {
        // If yes, increment the count for that order
        uniqueOrders[orderId].bidCount++;
        // Track writers who bid on this order
        const writerInfo = {
          id: bid.writer.id,
          username: bid.writer.username,
          email: bid.writer.email,
        };
        if (!uniqueOrders[orderId].writers.some(w => w.id === writerInfo.id)) {
          uniqueOrders[orderId].writers.push(writerInfo);
        }
      } else {
        // If not, add the order to uniqueOrders with count 1
        uniqueOrders[orderId] = {
          ...bid.order,
          bidCount: 1,
          writers: [{
            id: bid.writer.id,
            username: bid.writer.username,
            email: bid.writer.email,
          }],
        };
      }
    });

    // Extract the values (unique orders) from uniqueOrders object
    const uniqueOrderList = Object.values(uniqueOrders);

    res.json({ orders: uniqueOrderList });
  } catch (error) {
    console.error("Error getting bids with counts and writers:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// @desc    Get a single bid by ID
// @route   GET /api/bids/:id
// @access  Private (only accessible to authenticated users)
const getBidById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const bid = await prisma.bid.findUnique({ where: { id },
      include: {
        order: {
          select: {
            id: true,
            orderId: true,
            topic: true,
            costPerPage: true,
            deadline: true,
            remainingTime: true,
            status: true,
            fullAmount: true,
          },
        },
        writer: {
          select: {
            id: true,
            username: true,
            email: true,
            active: true,
          },
        }
      }});
    if (!bid) {
      res.status(404);
      throw new Error("Bid not found");
    }
    res.json(bid);
  } catch (error) {
    console.error("Error getting bid by ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Delete a bid by ID
// @route   DELETE /api/bids/:id
// @access  Private (only accessible to authenticated users)
const deleteBid = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const bid = await prisma.bid.findUnique({ where: { id } });
    if (!bid) {
      res.status(404);
      throw new Error("Bid not found");
    }
    await prisma.bid.delete({ where: { id } });
    res.json({ message: "Bid deleted successfully" });
  } catch (error) {
    console.error("Error deleting bid:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Delete a bid by writer ID
// @route   DELETE /api/bids/writer/:writerId/:bidId
// @access  Private (only accessible to authenticated users)
const deleteBidByWriterId = asyncHandler(async (req, res) => {
  const { writerId, bidId } = req.params;
  try {
    const bid = await prisma.bid.findFirst({
      where: {
        id: parseInt(bidId),
        writerId: parseInt(writerId)
      }
    });
    if (!bid) {
      res.status(404);
      throw new Error("Bid not found for the specified writer");
    }
    await prisma.bid.delete({ where: { id: parseInt(bidId) } });
    res.json({ message: "Bid deleted successfully" });
  } catch (error) {
    console.error("Error deleting bid by writer ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// @desc    Get bids by writer ID
// @route   GET /api/bids/writer/:writerId
// @access  Private (only accessible to authenticated users)
const getBidsByWriterId = asyncHandler(async (req, res) => {
  const { writerId } = req.params;
  try {
    // Fetch the user based on the provided writerId
    const user = await prisma.user.findUnique({
      where: { id: writerId },
      include: {
        bids: {
          //filter wher order is not assigned and status is pending
          where: {
            order: {
              status: "PENDING"
            }
          },
          include: {
            order: {
              select: {
                id: true,
                orderId: true,
                topic: true,
                costPerPage: true,
                deadline: true,
                remainingTime: true,
                status: true,
                fullAmount: true,
              },
            },
            writer: {
              select: {
                id: true,
                username: true,
                email: true,
                active: true,
              },
            }
          }
        }
      }
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Extract bids from the user object
    const bids = user.bids;
    
    res.json(bids);
  } catch (error) {
    console.error("Error getting bids by writer ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get all bids
// @route   GET /api/bids
// @access  Private (only accessible to authenticated users)
const getAllBids = asyncHandler(async (req, res) => {
  try {
    const bids = await prisma.bid.findMany({
      include: {
        order: {
          select: {
            id: true,
            orderId: true,
            topic: true,
            costPerPage: true,
            deadline: true,
            remainingTime: true,
            status: true,
            fullAmount: true,
          },
        },
        writer: {
          select: {
            id: true,
            username: true,
            email: true,
            active: true,
          },
        },
      },
    });
    res.json(bids);

    if (!bids) {
      res.status(404);
      throw new Error("Bids not found");
    }
  } catch (error) {
    console.error("Error getting bids:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = { createBid, getAllBids, getAllBidsForOrder, getBidById, deleteBid, getBidsByWriterId, deleteBidByWriterId , getAllBidsWithCountsAndWriters };
