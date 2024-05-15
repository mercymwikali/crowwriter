const asyncHandler = require("express-async-handler");
const express = require("express");
const multer = require("multer");
const router = express.Router();
const uploadController = require("../controllers/uploadDocument");
const path = require("path");
const { verifyJwt } = require("../middleware/verifyJwt");
const { v4: uuidv4 } = require('uuid'); // Import uuidv4 function



// Multer configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/documents/');
  },
  filename(req, file, cb) {
    const documentId = uuidv4(); // Generate UUID
    const originalFileName = file.originalname.replace(/\s/g, ''); // Remove spaces from the original filename
    const uniqueFileName = `${documentId}-${originalFileName}`;
    console.log('Generated Unique Filename:', uniqueFileName); // Log the unique filename to the console
    cb(null, uniqueFileName);
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('PDF, DOC, or DOCX files only!');
  }
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.use(verifyJwt);
// Define the route for uploading a document to the server it will be stored in the 'uploads/documents' folder and the single file will be stored in the 'file' key
router.post("/upload", upload.single('file'), uploadController.uploadDocument);
//fetch documents

router.get("/fetch-documents", uploadController.getDocuments);


// Define the route for downloading a document
router.get("/download/:documentId", uploadController.downloadDocument);


module.exports = router;
