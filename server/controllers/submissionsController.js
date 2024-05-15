const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const submitJob = asyncHandler(async (req, res) => {
  try {
    const { orderId, writerId, documentId } = req.body;

    // Check if the order exists and check if status is assigned
    const orderExists = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });

    if (!orderExists || orderExists.status !== "ASSIGNED") {
      return res.status(404).json({ error: "Order not found or not assigned" });
    }

    // Check if the writer exists and check if status is active
    const writerExists = await prisma.user.findUnique({
      where: { id: writerId },
      select: { active: true },
    });

    if (!writerExists || !writerExists.active) {
      return res.status(404).json({ error: "Writer not found or not active" });
    }

    // Create a new submission
    const newSubmission = await prisma.submittedOrder.create({
      data: {
        orderId: orderId,
        submittedById: writerId,
        documentId: documentId,
        submissionDate: new Date(),
        status: "COMPLETED",
      },
    });

    // Update the order status to submitted
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
      },
    });

    return res
      .status(200)
      .json({ message: "Job Submitted successfully", data: newSubmission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


const getSubmittedDocuments = asyncHandler(async (req, res) => {
  try {
    //fetch the submission details
    const submission = await prisma.submittedOrder.findMany({});

    const documents = [];
    //loop through each submission to extract document details
    for (const sub of submission) {
      if (sub.documentId) {
        const document = {
          documentId: sub.documentId,
          orderId: sub.orderId,
          submittedById: sub.submittedById,
          submissionDate: sub.submissionDate,
          status: sub.status,
          filePath: path.join(
            __dirname,
            `../uploads/jobSubmission/${sub.documentId}`
          ), // Add file path
        };
        documents.push(document);
      }
    }

    //return the document details to the client
    return res.status(200).json({ success: true, documents: documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Function to upload Job Submission files
const uploadJobSubmission = asyncHandler(async (req, res) => {
  try {
    const { filename } = req.file;

    console.log(filename);

    if (!filename) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    //extracting the document id from the filename
    const documentId = filename;

    //send the document id back to the client
    console.log(documentId);
    res
      .status(200)
      .json({
        success: true,
        message: "Document uploaded successfully",
        filename: filename,
        documentId: documentId,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Function to download Job Submission files
const downloadJobSubmission = asyncHandler(async (req, res) => {
  try {
    const { documentId } = req.params;

    // Get the file path using the reconstructed filename
    const filePath = path.join(
      __dirname,
      `../uploads/jobSubmission/${documentId}`
    );

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).json({ error: "File not found" });
    }

    console.log(`Downloading file: ${filePath}`);

    // Set appropriate headers for file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${documentId}"`
    );
    res.setHeader("Content-Type", "application/pdf", {
      "Content-Type": "application/document",
    }); // Adjust content type based on file type if needed

    // Stream the file for download
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (error) => {
      console.error(`Error streaming file: ${error}`);
      res.status(500).json({ error: "Server error" });
    });


    fileStream.on("end", () => {
      console.log(`File downloaded successfully: ${filePath}`);
    })


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = {
    submitJob,
    getSubmittedDocuments,
    uploadJobSubmission,
    downloadJobSubmission
    
  };