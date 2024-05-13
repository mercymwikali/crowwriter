// seeds.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Seed users
  const users = [
    {
      username: 'test',
      email: 'test@email.com',
      password: '123test',
      role: 'writer',
      active: true,
    },
    
    // Add more users as needed
  ];

  // Seed orders
  const orders = [
    {
      orderId: 'order1',
      topic: 'Topic 1',
      discipline: 'Discipline 1',
      service: 'Service 1',
      description: 'Description 1',
      format: 'Format 1',
      noOfPages: 5,
      costPerPage: 10.50,
      fullAmount: 52.50,
      deadline: new Date(),
      remainingTime: '2 days',
      status: 'PENDING',
    },
    {
      orderId: 'order2',
      topic: 'Topic 2',
      discipline: 'Discipline 2',
      service: 'Service 2',
      description: 'Description 2',
      format: 'Format 2',
      noOfPages: 8,
      costPerPage: 12.75,
      fullAmount: 102,
      deadline: new Date(),
      remainingTime: '1 day',
      status: 'PENDING',
    },
    // Add more orders as needed
  ];

  // Create users
  const createdUsers = await Promise.all(
    users.map((userData) => prisma.user.create({ data: userData }))
  );

  // Create orders
  const createdOrders = await Promise.all(
    orders.map((orderData) => prisma.order.create({ data: orderData }))
  );

  console.log('Users seeded:', createdUsers);
  console.log('Orders seeded:', createdOrders);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  
