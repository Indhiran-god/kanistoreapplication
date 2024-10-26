const Product = require('../models/productModel'); // Ensure this path is correct based on your project structure

const getProductDetails = async (req, res) => {
    const { productId } = req.params; // Get productId from URL parameters

    try {
        const product = await Product.findById(productId); // Fetch the product using the ID

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ data: product });
    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = getProductDetails;
