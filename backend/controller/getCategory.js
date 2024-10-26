const CategoryModel = require("../models/Category"); // Use a different name for the model

const getCategories = async (req, res) => { // Change the function name to avoid conflict
    try {
        const allCategories = await CategoryModel.find().sort({ createdAt: -1 }); // Use the correct variable name

        res.json({
            message: "All Categories",
            success: true,
            error: false,
            data: allCategories // Use the correct variable name
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = getCategories; // Export the function with the new name
