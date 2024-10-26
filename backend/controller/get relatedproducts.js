const Product = require('../models/productModel'); // Ensure this path is correct based on your project structure

const getRelatedProducts = async (req, res) => {
    const { subcategoryId } = req.params; // Get subcategoryId from URL parameters

    try {
        // Fetch products that belong to the same subcategory, excluding the current product if needed
        const relatedProducts = await Product.find({ subcategoryId }).limit(4); // Adjust limit as needed

        if (!relatedProducts.length) {
            return res.status(404).json({ message: "No related products found" });
        }

        res.json({ products: relatedProducts });
    } catch (error) {
        console.error("Error fetching related products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = getRelatedProducts;
