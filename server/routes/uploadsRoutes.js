const express = require("express");
const multer = require("multer");
const router = express.Router();
const uploadController = require("../controllers/uploadDocument");
const path = require("path");

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/documents/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
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

router.post("/upload", upload.single('file'), uploadController.uploadDocument);

module.exports = router;
