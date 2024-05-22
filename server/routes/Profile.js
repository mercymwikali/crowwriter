const express = require('express');
const router = express.Router();
const{getProfile, updateProfile}=require("../controllers/ProfileController")
// Fetch profile details
router.get('/user-profile/:id', getProfile );

// Update profile details
router.patch('/update-profile/:id', updateProfile);

module.exports = router;
