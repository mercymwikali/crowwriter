const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

const submitJob = asyncHandler(async (req, res) => {
  try {
    const { orderId, writerId, documentId } = req.body;

    // Check if the order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order is already submitted
    if (order.status === 'SUBMITTED') {
      return res.status(400).json({ message: 'Order already submitted' });
    }

    // Check if the order is assigned
    if (order.status !== 'ASSIGNED') {
      return res.status(400).json({ message: 'Order not assigned' });
    }

    // Check if the writer exists and if they are active
    const writer = await prisma.user.findUnique({
      where: { id: writerId },
      select: { active: true },
    });

    if (!writer) {
      return res.status(404).json({ message: 'Writer not found' });
    }

    if (!writer.active) {
      return res.status(400).json({ message: 'Writer not active' });
    }

    // Create a new submission
    const newSubmission = await prisma.submittedOrder.create({
      data: {
        orderId,
        submittedById: writerId,
        documentId,
        submissionDate: new Date(),
        status: 'SUBMITTED',
      },
    });

    // Update the order status to SUBMITTED
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'SUBMITTED' },
    });

    return res.status(200).json({
      message: 'Job Submitted successfully',
      data: newSubmission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// get all submitted documents
const getSubmittedDocuments = asyncHandler(async (req, res) => {
  try {
    const submissions = await prisma.submittedOrder.findMany({
      include: {
        order: {
          select: {
            orderId: true,
            topic: true,
            noOfPages: true,
            fullAmount: true,
            deadline: true,
            status: true,
          },
        },
        submittedBy: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    const documents = submissions.map(sub => ({
      documentId: sub.documentId,
      orderId: sub.order.orderId,
      topic: sub.order.topic,
      noOfPages: sub.order.noOfPages,
      amount: sub.order.fullAmount,
      deadline: sub.order.deadline,
      status: sub.order.status,
      submittedBy: sub.submittedBy.username,
      submittedByEmail: sub.submittedBy.email,
      submissionDate: sub.submissionDate,
      documentStatus: sub.status,
      filePath: path.join(__dirname, `../uploads/jobSubmission/${sub.documentId}`),
    }));

    return res.status(200).json({ success: true, documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


// get all submitted documents by writer ID

const getSubmittedDocumentsByWriter = asyncHandler(async (req, res) => {
  try {
    const { writerId } = req.params;
    const submissions = await prisma.submittedOrder.findMany({
      where: { submittedById: writerId },
      include: {
        order: {
          select: {
            orderId: true,
            topic: true,
            noOfPages: true,
            fullAmount: true,
            deadline: true,
            status: true,
          },
        },
        submittedBy: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    const documents = submissions.map(sub => ({
      documentId: sub.documentId,
      orderId: sub.order.orderId,
      topic: sub.order.topic,
      noOfPages: sub.order.noOfPages,
      amount: sub.order.fullAmount,
      deadline: sub.order.deadline,
      status: sub.order.status,
      submittedBy: sub.submittedBy.username,
      submittedByEmail: sub.submittedBy.email,
      submissionDate: sub.submissionDate,
      documentStatus: sub.status,
      filePath: path.join(__dirname, `../uploads/jobSubmission/${sub.documentId}`),
    }));

    return res.status(200).json({ success: true, documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const uploadJobSubmission = asyncHandler(async (req, res) => {
  try {
    const { filename } = req.file;

    if (!filename) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const documentId = filename;
    res.status(200).json({
      success: true,
      message: "Document uploaded successfully",
      filename,
      documentId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const downloadJobSubmission = asyncHandler(async (req, res) => {
  try {
    const { documentId } = req.params;
    const filePath = path.join(__dirname, `../uploads/jobSubmission/${documentId}`);

    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).json({ error: "File not found" });
    }

    console.log(`Downloading file: ${filePath}`);
    res.setHeader("Content-Disposition", `attachment; filename="${documentId}"`);
    res.setHeader("Content-Type", "application/pdf"); // Adjust content type based on file type if needed

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (error) => {
      console.error(`Error streaming file: ${error}`);
      res.status(500).json({ error: "Server error" });
    });

    fileStream.on("end", () => {
      console.log(`File downloaded successfully: ${filePath}`);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const deleteSubmittedOrder = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const submittedOrder = await prisma.submittedOrder.findUnique({
      where: { id },
    });

    if (!submittedOrder) {
      return res.status(404).json({ message: 'Submitted order not found' });
    }

    const filePath = path.join(__dirname, `../uploads/jobSubmission/${submittedOrder.documentId}`);
    await prisma.submittedOrder.delete({ where: { id } });

    await prisma.order.update({
      where: { id: submittedOrder.orderId },
      data: { status: 'ASSIGNED' },
    });

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
        return res.status(200).json({
          message: 'Submitted order deleted from the database, but failed to delete the file from storage',
        });
      }
      console.log(`File deleted successfully: ${filePath}`);
    });

    return res.status(200).json({ message: 'Submitted order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = {
  submitJob,
  getSubmittedDocuments,
  getSubmittedDocumentsByWriter,
  uploadJobSubmission,
  downloadJobSubmission,
  deleteSubmittedOrder,
};
