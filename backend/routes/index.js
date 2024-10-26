const express = require('express');
const router = express.Router();
const userSignUpController = require("../controller/userSignUp");
const userSignInController = require("../controller/userSignIn");
const userDetailsController = require('../controller/userDetails');
const authToken = require('../middleware/authToken');
const userLogout = require('../controller/userLogout');
const getCategories = require('../controller/getCategory');
const getSubcategories = require('../controller/getSubcategory');
const getProductsBySubcategory = require('../controller/getProductsBySubcategory');
const getProductDetails = require('../controller/getProductDetails');
const getRelatedProducts = require('../controller/get relatedproducts');

// User routes
router.post("/signup", userSignUpController); // POST /api/signup
router.post("/signin", userSignInController); // POST /api/signin
router.get("/user-details", authToken, userDetailsController); // GET /api/user-details
router.get("/userLogout", userLogout); // GET /api/userLogout

// Product routes
router.get("/Category", getCategories); // GET /api/Category
router.get('/category/:categoryName/subcategories', getSubcategories); 
router.get('/subcategories/:subcategoryId/products', getProductsBySubcategory);
router.get('/product-details/:productId', getProductDetails); // Updated route for fetching product details
router.get('/related/:subcategoryId', getRelatedProducts);
module.exports = router;
