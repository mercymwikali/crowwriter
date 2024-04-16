const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const prisma = new PrismaClient();
const router = express.Router();

// Route to create a new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role, active } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        active
      },
    });
    res.status(200).json({
      status: 200,
      message: "User created successfully",
      user,
    });
    console.log(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Route to login an existing user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    // If login successful, you can return the user details or a token for authentication
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      "secretkey123",
      {
        expiresIn: "1h",
      }
    )
    user.accessToken = accessToken
    res.cookie('access_token', accessToken, { httpOnly: true });
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
