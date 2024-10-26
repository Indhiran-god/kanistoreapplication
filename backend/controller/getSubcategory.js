const Category = require('../models/Category'); // Import the Category model

// Controller to get subcategories for a specific category
const getSubcategories = async (req, res) => {
  const { categoryName } = req.params; // Get categoryName from request parameters

  try {
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    return res.status(200).json({ success: true, data: category.subCategories });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Export the controller function
module.exports = getSubcategories;
