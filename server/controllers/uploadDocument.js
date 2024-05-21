const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
// Function to get the list of documents
// Function to get the list of documents with file paths
const getDocuments = asyncHandler(async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await prisma.order.findMany();

    // Initialize an array to hold document details
    const documents = [];

    // Loop through each order to extract document details
    for (const order of orders) {
      if (order.documentId) {
        const document = {
          documentId: order.documentId,
          orderId: order.orderId,
          topic: order.topic,
          discipline: order.discipline,
          service: order.service,
          format: order.format,
          noOfPages: order.noOfPages,
          costPerPage: order.costPerPage,
          fullAmount: order.fullAmount,
          deadline: order.deadline,
          remainingTime: order.remainingTime,
          status: order.status,
          filePath: path.join(__dirname, `../uploads/documents/${order.documentId}`) // Add file path
        };
        documents.push(document);
      }
    }

    // Send the list of documents with associated order details as the response
    res.status(200).json({ success: true, documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Function to handle document upload
const uploadDocument = asyncHandler(async (req, res) => {
  try {

    const {filename} = req.file;
  
    console.log(filename);
    if (!filename) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    //extracting the document id from the filename
    const documentId = filename
    //send the document id back to the client

    console.log(documentId);
    res.status(200).json({ success: true, message: "Document uploaded successfully", documentId, filename });


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Function to handle file downloads
const downloadDocument = asyncHandler(async (req, res) => {
  try {
    const { documentId } = req.params;

    // Get the file path using the reconstructed filename
    const filePath = path.join(__dirname, `../uploads/documents/${documentId}`);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).json({ error: "File not found" });
    }

    console.log(`Downloading file: ${filePath}`);

    // Set appropriate headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${documentId}"`);
    res.setHeader('Content-Type', 'application/pdf'); // Adjust content type based on file type if needed

    // Stream the file for download
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error(`Error streaming file: ${error}`);
      res.status(500).json({ error: "Server error" });
    });

    fileStream.on('end', () => {
      console.log('File streaming completed');
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});




module.exports = { uploadDocument, getDocuments, downloadDocument };
