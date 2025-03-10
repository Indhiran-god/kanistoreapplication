import React, { useState, useEffect } from 'react';
import { HiSearch } from 'react-icons/hi';
import { FaUserCircle, FaWhatsapp } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Logo from './Logo';


const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const URLSearch = new URLSearchParams(location.search);
  const searchQuery = URLSearch.get("q") || "";

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setUserDetails(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      const response = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(null));
        navigate('/login');
      } else {
        toast.error(data.message || 'Logout failed');
      }
    } catch (error) {
      toast.error('Error logging out. Please try again.');
      console.error('Logout error:', error);
    }
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`${SummaryApi.searchProduct.url}?query=${encodeURIComponent(value)}`);
      const data = await response.json();
      setSearchResults(data.products || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      toast.error("Error fetching search results");
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <header className="h-16 shadow-md bg-white relative">
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        <div className="flex items-center">
          <Link to="/">
            <Logo w={90} h={50} />
          </Link>
          <a
            href="https://wa.me/9025301089"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 text-2xl ml-4"
            aria-label="Chat on WhatsApp"
          >
            <FaWhatsapp />
          </a>
        </div>

        {/* The rest of the Header component remains unchanged */}
        
        <div className="flex lg:hidden items-center">
          <button onClick={() => setSearchVisible(!searchVisible)} className="text-lg" aria-label="Toggle search">
            <HiSearch />
          </button>
          {searchVisible && (
            <div className="absolute top-16 left-0 w-full bg-white shadow-md z-10 rounded-full">
              <div className="container mx-auto px-4 py-2 flex">
                <input
                  type="text"
                  placeholder="Search product here..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full outline-none border rounded-l-full py-2 px-3"
                  aria-label="Search"
                />
                <button className="bg-green-500 text-white px-4 rounded-r-full" aria-label="Search">
                  <HiSearch />
                </button>
              </div>
              {searchResults.length > 0 && (
                <div className="absolute bg-white shadow-md z-20 rounded w-full">
                  {searchResults.map((product) => (
                    <div key={product._id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleProductClick(product._id)}>
                      {product.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center w-full max-w-sm border rounded-full focus-within:shadow-md pl-2">
          <input
            type="text"
            placeholder="Search product here..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full outline-none"
            aria-label="Search"
          />
          <div className="text-lg min-w-[50px] h-8 bg-green-500 flex items-center justify-center rounded-r-full text-white">
            <HiSearch />
          </div>
        </div>

        <div className="flex items-center gap-7">
          {user?._id && (
            <Link to="/user-details" className="text-3xl cursor-pointer" aria-label="User profile">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  className="w-10 h-10 rounded-full object-cover"
                  alt={user.name || 'User'}
                />
              ) : (
                <FaUserCircle />
              )}
            </Link>
          )}

          {user?._id ? (
            <button onClick={handleLogout} className="px-3 py-1 rounded-full text-white bg-green-500 hover:bg-green-700">
              Logout
            </button>
          ) : (
            <Link to="/login" className="px-3 py-1 rounded-full text-white bg-green-500 hover:bg-green-700">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
