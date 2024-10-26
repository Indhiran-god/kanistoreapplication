const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');

async function userSignUpController(req, res) {
    try {
        const { email, password, name, address, phoneNo } = req.body;

        // Check if user already exists
        const user = await userModel.findOne({ email });
        console.log("user", user);

        if (user) {
            throw new Error("User already exists.");
        }

        // Validation for required fields
        if (!email) {
            throw new Error("Please provide an email.");
        }
        if (!password) {
            throw new Error("Please provide a password.");
        }
        if (!name) {
            throw new Error("Please provide a name.");
        }
        if (!address) {
            throw new Error("Please provide an address.");
        }
        if (!phoneNo) {
            throw new Error("Please provide a phone number.");
        }

        // Password hashing
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt);

        if (!hashPassword) {
            throw new Error("Something went wrong with password hashing.");
        }

        // Payload for creating user
        const payload = {
            name,
            email,
            password: hashPassword,
            role: "GENERAL",
            address: {
                street: address.street,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country
            },
            phoneNo
        };

        // Save the user
        const userData = new userModel(payload);
        const saveUser = await userData.save();

        // Send success response
        res.status(201).json({
            data: saveUser,
            success: true,
            error: false,
            message: "User created successfully!"
        });

    } catch (err) {
        // Send error response
        res.json({
            message: err.message || err,
            error: true,
            success: false,
            sameSite: 'None'
        });
    }
}

module.exports = userSignUpController;
