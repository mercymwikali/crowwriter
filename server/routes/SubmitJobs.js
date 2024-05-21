const asyncHandler = require("express-async-handler");
const express = require("express");
const multer = require("multer");
const router = express.Router();
const submitJob = require("../controllers/submissionsController");
const path = require("path");
const { verifyJwt } = require("../middleware/verifyJwt");
const { v4: uuidv4 } = require('uuid');


// Multer configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/jobSubmission/');
  },
  filename(req, file, cb) {
    const documentId = uuidv4(); // Generate UUID
    const originalFileName = file.originalname.replace(/\s/g, ''); // Remove spaces from the original filename
    const uniqueFileName = `${documentId}-${originalFileName}`;
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

// Route for submitting a job
router.post('/submit-order', submitJob.submitJob);

// Route for uploading job documents
router.post('/job-docs', upload.single('files'), submitJob.uploadJobSubmission);  // Ensure 'files' is used here
// Route for fetching all job documents
router.get('/fetch-jobs-docs', submitJob.getSubmittedDocuments);

// Route for fetching job documents by writer ID
router.get('/fetch-jobs-docs/writer/:writerId', submitJob.getSubmittedDocumentsByWriter);

// Route for downloading job documents by document ID
router.get('/fetch-job-docs/:documentId', submitJob.downloadJobSubmission);

// Route for deleting a submitted order by ID
router.delete('/delete-order/:id', submitJob.deleteSubmittedOrder);

module.exports = router;
