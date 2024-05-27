const express = require("express");
const router = express.Router();
const userController = require('../controllers/UsersController');
const{getProfile, updateProfile}=require("../controllers/ProfileController")

const { verifyJwt, adminRoute } = require('../middleware/verifyJwt'); // Import the middleware functions correctly

// Middleware to verify JWT token for specific routes
// router.use(verifyJwt);

// Fetching the users list
router.get("/fetch-All-Users", userController.getAllUsers);

// Getting users by Id
router.get("/fetch-UserById/:id", userController.userById);

// Fetching the writers list
router.get("/fetch-All-writers", userController.getWriters);

// Edit/update user
router.patch("/updateUser/:id", userController.editUser);

//profile
router.get('/profile/:id', getProfile );

router.patch('/update-profile/:id', updateProfile);


// Delete user by id
router.delete("/deleteUser/:id", userController.deleteUser);

module.exports = router;
