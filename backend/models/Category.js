const mongoose = require('mongoose');

// Define the subcategory schema
const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // Subcategory name is required
  },
  image: {
    type: [String], // Store image URL/path
    required: true // Optional field for subcategory image
  }
});

// Define the category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // Ensure that category names are unique
  },
  subCategories: {
    type: [subCategorySchema], // Array of subcategories
    default: [] // Default to an empty array
  }
});

// Create and export the model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
