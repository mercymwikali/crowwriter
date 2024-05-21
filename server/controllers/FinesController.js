//this is a fines controller where we'll be creating updating deleting fine records for the writers

const asyncHandler = require("express-async-handler");
const {Prisma} = require('@prisma/client');

const prisma = new Prisma.PrismaClient();


const CreateFine = asyncHandler(async (req, res) => {

    const {fine} = req.body;
    try {
        
    } catch (error) {
        
    }
})

module.exports = {};