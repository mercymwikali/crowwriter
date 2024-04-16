const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Get all orders (private route)
const getAllOrder = async (req, res) => {
  try {
    const orders = await prisma.order.findMany();

    if (!orders.length) {
      return res.status(404).json({ error: "No orders found" });
    }

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const writer = await prisma.user.findUnique({
          where: {
            id: order.writerId,
          },
        });
        return { ...order, writerName: writer.username };
      })
    );

    res.status(200).json(ordersWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving orders" });
  }
};

// Create an order// Create an order
const createOrder = async (req, res) => {
    try {
      const {
        OrderId,
        topic,
        typeofPaper,
        discipline,
        noOfPages,
        deadline,
        description,
        attachment,
        citation,
        service,
        costPerPage,
        totalCost,
        OrderStatus, // Corrected field name
        assignedToId,
        writerId,
      } = req.body;
  
    //   // Confirm required fields
    //   if (
    //     !OrderId ||
    //     !topic ||
    //     !noOfPages ||
    //     !deadline ||
    //     !costPerPage ||
    //     !totalCost ||
    //     !OrderStatus // Corrected field name
    //   ) {
    //     return res.status(400).json({ error: "All fields are required" });
    //   }
  
      // Check for duplicate order
      const existingOrder = await prisma.order.findUnique({
        where: {
          OrderId,
        },
      });
  
      if (existingOrder) {
        return res.status(409).json({ error: "Order already exists" });
      }
  
      // Create new order
      const newOrder = await prisma.order.create({
        data: {
          OrderId,
          topic,
          typeofPaper,
          discipline,
          noOfPages,
          deadline,
          description,
          attachment,
          citation,
          service,
          costPerPage,
          totalCost,
          OrderStatus, // Corrected field name
          assignedToId,
          writerId,
        },
      });
  
      // Send response
      if (newOrder) {
        return res
          .status(201)
          .json({ message: "Order created successfully", data: newOrder });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating order" });
    }
  };
  
// Update order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {  OrderId,
        topic,
        typeofPaper,
        discipline,
        noOfPages,
        deadline,
        description,
        attachment,
        citation,
        service,
        costPerPage,
        totalCost,
        OrderStatus, // Corrected field name
        assignedToId,
        writerId } = req.body;

      const order = await prisma.order.findUnique({
      where: {
        id: Number(id),
      },
    });

    // If order not found, return error
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

   const updatedOrder = await prisma.order.update({
      where: {
        id: Number(id),
      },
      data: {
        OrderId,
        topic,
        typeofPaper,
        discipline,
        noOfPages,
        deadline,
        description,
        attachment,
        citation,
        service,
        costPerPage,
        totalCost,
        OrderStatus, // Corrected field name
        assignedToId,
        writerId,
      },

   })

   if (updatedOrder) {
    return res.status(200).json({ message: "Order updated successfully", data: updatedOrder });
    
   }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating order" });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    await prisma.order.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting order" });
  }
};

// Get all orders without details
const getAllOrdersWithoutDetails = async (req, res) => {
  try {
    const orders = await prisma.order.findMany();

    if (!orders.length) {
      return res.status(404).json({ error: "No orders found" });
    }

    res.status(200).json({
      orders: orders,
      message: "Orders retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving orders" });
  }
};

module.exports = {
  getAllOrder,
  getAllOrdersWithoutDetails,
  createOrder,
  updateOrder,
  deleteOrder,
};
