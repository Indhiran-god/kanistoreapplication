const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');

async function user_UpdateController(req, res) {
    try {
        const { userId } = req; // Assuming you have userId in req after authentication
        const { name, address } = req.body; // Get fields to update

        // Find user by ID
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Update the user's details
        user.name = name || user.name; // Update only if provided
        user.address = address || user.address; // Update only if provided

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: "User details updated successfully!",
            updatedUser,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || "An error occurred while updating user details.",
        });
    }
}

module.exports = user_UpdateController;
