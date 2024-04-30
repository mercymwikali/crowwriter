const asyncHandler = require("express-async-handler");
const { PrismaClient, Role } = require("@prisma/client");

const prisma = new PrismaClient();

//getAllUsers list
// @@private route GET /get-users

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });
    console.log(users);

    res.json({ status: 200, message: "Successful retrieval", users });
  } catch (error) {
    throw new Error("Error Fetching List");
  }
});

//users by route GET /get-users/:id
//private to admin and managers

const userById = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//admin & manager route to find all writers
const getWriters = asyncHandler(async (req, res) => {
  try {
    const writers = await prisma.user.findMany({
      where: {
        role: Role.writer,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        active: true,
      },
    });
    res.status(201).json(writers);
  } catch (error) {
    throw new Error("Error fetching writers");
  }
});

//manager route to edit writer details

const editUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        active: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //hash password if password is provided
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updatedUser.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...req.body,
      },
    });
    res
      .status(200)
      .json({ message: `User ${updatedUser.username} updated successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //checking if the user is active before deleting
    if (user.active === true) {
      return res.status(400).json({ error: "Cannot delete active user" });
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    res.json({ message: "User Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { getAllUsers, userById, deleteUser, getWriters, editUser };
