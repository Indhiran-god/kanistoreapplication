import { createBrowserRouter } from "react-router-dom";
import App from '../App';
import Home from '../pages/Home'; 
import Login from '../pages/Login'; 
import ForgotPassword from '../pages/ForgotPassword'; 
import SignUP from '../pages/SignUP';  
import Userdetails from '../pages/Persondetails';
import SubCategoryPage from "../components/SubCategory"; 
import Cart from '../pages/Cart';
import ProductPage from "../components/productpage";
import Orders from "../pages/orders";
import SearchProduct from '../pages/SearchProduct';
import Categories from "../pages/categ";

const router = createBrowserRouter([
    {
        path: "*", // This will match all paths
        element: <App />, // Main app component
        children: [
            {
                path: "", // Root path
                element: <Home /> // Home component
            },
            {
                path: "login", // Login path
                element: <Login />
            },
            {
                path: "forgot-password", // Forgot password path
                element: <ForgotPassword />
            },
            {
                path: "user-details", // User details path
                element: <Userdetails />
            },
            {
                path : "search",
                element : <SearchProduct/>
            },
            {
                path : 'cart', // Cart page path
                element : <Cart/>
            },
            {
                path: 'orders',
                element: <Orders/>
            },
            {
                path: "sign-up", // Sign up path
                element: <SignUP />
            },
            {
                path: "categories", // Categories page path
                element: <Categories /> // Categories component
            },
            {
                path: "sub", // SubCategory page path
                element: <SubCategoryPage />
            },
            {
                path: "category/:categoryName", // Nested route for SubCategory
                element: <SubCategoryPage />, // SubCategory component
            },
            {
                path: 'product/:id', // Fixed dynamic route for ProductPage
                element: <ProductPage />, // ProductPage component
            }
        ]
    }
]);

export default router;
