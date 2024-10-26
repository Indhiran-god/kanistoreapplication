import React, { useEffect, createContext, useState } from 'react';
import './App.css';
import { Routes, Route, Outlet } from 'react-router-dom'; // Remove Router here
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import SummaryApi from './common';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setUserDetails } from './store/userSlice';
import SubCategory from './components/SubCategory'; // Keep SubCategory import
import ProductPage from './components/productpage'; // Correct import case for ProductPage

// Create Context
export const UserContext = createContext();

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user); // Fetch user data from Redux
  const [loading, setLoading] = useState(true); // Loading state

  // Function to fetch user details
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        dispatch(setUserDetails(data.data)); // Store user details in Redux
      } else {
        toast.error('Failed to fetch user details');
      }
    } catch (error) {
      toast.error('Error fetching user details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails(); // Fetch user details on component mount
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>; // Display a loading state
  }

  return (
    <UserContext.Provider value={{ fetchUserDetails, user }}>
      <ToastContainer position='top-center' />
      <Header />
      <main className="min-h-[calc(100vh-120px)] pt-16"> {/* Add padding for layout */}
        <Outlet /> {/* This will render nested routes */}
      </main>
      <Footer />
    </UserContext.Provider>
  );
}

// Export the App component without the Router
export default App;


