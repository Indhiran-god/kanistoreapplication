const mongoose = require('mongoose');

// Address subdocument schema
const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
}, { _id: false }); // Disable _id for subdocuments

// User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true, // Store emails in lowercase
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: null, // Default to null if no profile picture is provided
    },
    role: {
        type: String,
        enum: ['GENERAL', 'ADMIN'], // Define possible roles
        default: 'GENERAL', // Default role
    },
    address: addressSchema, // Embed the address schema
    phoneNo: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create and export the user model
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
