const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");

// Function to get the list of documents
const getDocuments = asyncHandler(async (req, res) => {
  try {
    // Define the directory where the documents are stored
    const directoryPath = path.join(__dirname, '../uploads/documents');

    // Read the files in the directory
    fs.readdir(directoryPath, function (err, files) {
      // Handle any errors
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error reading documents" });
      }

      // Send the list of files as the response
      res.status(200).json({ success: true, files });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Function to handle document upload
const uploadDocument = asyncHandler(async (req, res) => {
  try {
    console.log(req.file);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.status(200).json({ success: true, file: req.file });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = { uploadDocument, getDocuments };
