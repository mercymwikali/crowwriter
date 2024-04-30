const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const loginUser = asyncHandler(async (req, res) => {
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

    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "email": user.email,
          "username": user.username,
          "roles": user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15min" }
    );

    const refreshToken = jwt.sign(
      {
        "UserInfo": {
          "email": user.email,
          "username": user.username,
          "roles": user.role,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const refreshToken = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ error: "You are not authenticated" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(403).json({ error: "Token is not valid" });
        }

        const { email, username, roles } = decoded.UserInfo; // Destructure UserInfo from decoded object

        const newAccessToken = jwt.sign(
          {
            UserInfo: {
              email,
              username,
              roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15min" }
        );

        res.cookie("refresh_token", refreshToken, {
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          // httpOnly: true,
        });

        res.json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid email or Password" });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.json({ message: "You are successfully logged out" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role, active } = req.body;

  const findUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!findUser) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with the hashed password
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        active,
      },
    });

    res.status(201).json({
      message: `User ${newUser.username} created successfully`,
    });
  } else {
    res.status(400).json({ error: 'User already exists' });
  }
});

module.exports = { loginUser, refreshToken, logoutUser, registerUser };
