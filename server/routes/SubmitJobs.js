const asyncHandler = require("express-async-handler");
const express = require("express");
const multer = require("multer");
const router = express.Router();
const submitJob = require("../controllers/submissionsController");
const path = require("path");
const { verifyJwt } = require("../middleware/verifyJwt");
const { v4: uuidv4 } = require('uuid'); // Import uuidv4 function



// Multer configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/jobSubmission/');
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


// Route for submitting a job
router.post('/submit', submitJob.submitJob);

router.post('/job-docs', upload.single('file'), submitJob.uploadJobSubmission);
//fetch all jobs
router.get("/fetch-jobs-docs", submitJob.getSubmittedDocuments );

//fetch job by id
router.get("/fetch-job-docs/:id", submitJob.downloadJobSubmission );

module.exports = router;
