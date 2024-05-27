const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getProfile = asyncHandler(async (req, res) => {
    const { id } = req.params; // Accessing user ID from route parameters
    try {
        const profile = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                active: true,
                profile: {
                    select: {
                        id: true,
                        bio: true,
                        wallet: true
                    }
                }
            },
        });
        res.status(200).json(profile);  
    } catch (error) {
        console.error("Error Fetching Profile:", error);
        res.status(500).json({ message: "Error fetching profile details." });
    }
});
// Update profile details
const updateProfile = asyncHandler(async (req, res) => {
    const { id } = req.params; // Accessing user ID from route parameters
    try {
        const updatedProfile = await prisma.profile.update({
            where: {
                userId: id
            },
            data: {
                ...req.body
            },
        });
        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error updating profile details." });
    }
});

module.exports = { getProfile, updateProfile };
