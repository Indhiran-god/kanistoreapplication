const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    images: {
        type: [String], // Assuming images are stored as an array of strings
        required: true // Ensure this is set to true if image is mandatory
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category' // Reference to the Category model
    }
});

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    categoryImage: {
        type: [String], // Assuming images are stored as an array of strings
        required: true // This is now correctly closed with a comma
    },
    subCategories: {
        type: [subcategorySchema],
        required: true // Ensure this is set to true if subcategories are mandatory
    }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
