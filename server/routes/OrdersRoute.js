// routes/orderRoutes.js
const express = require('express');
const{PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

const router = express.Router();

const verifyJwt = require('../middleware/verifyJwt');

router.use(verifyJwt);

// Route to create a new order
router.post('/', async (req, res) => {
  try {
    const {
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
      writerId,
    } = req.body;
    const order = await prisma.order.create({
      data: {
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
        writerId,
        status: 'PENDING', // Default status
      },
    });
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating order' });
  }
});


// Route to get all orders
router.get('/get-orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({});
    res.status(200).json({
      orders: orders,
      message: 'Orders retrieved successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving orders' });
  }
})

//update order by id
router.patch('/update-order/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await prisma.order.update({
      where: {
        id: Number(id),
      },
      data: {
        status,
      },
    });
    res.status(200).json({
      message: 'Order updated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating order' });
  }
})


//delete order
router.delete('/delete-order/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting order' });
  }
})

module.exports = router;
