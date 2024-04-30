const asyncHandler = require("express-async-handler");

module.exports.uploadDocument = asyncHandler(async (req, res) => {
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
