const Product = require('../models/productModel'); // Import the Product model

// Controller to get products for a specific subcategory
const getProductsBySubcategory = async (req, res) => {
  const { subcategoryId } = req.params; // Get subcategoryId from request parameters

  try {
    // Find products that belong to the specified subcategory
    const products = await Product.find({ subcategoryId });

    if (!products.length) {
      return res.status(404).json({ success: false, message: 'No products found for this subcategory' });
    }

    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Export the controller function
module.exports = getProductsBySubcategory;
