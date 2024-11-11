import React from 'react';
import { FaHome, FaThLarge, FaSearch, FaClipboardList, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2 flex justify-around text-gray-600">
      <button
        onClick={() => navigate('/')}
        className="flex flex-col items-center focus:outline-none hover:text-gray-800"
        title="Home - Siva Store"
      >
        <FaHome size={20} />
        <span className="text-xs">Siva Store</span>
      </button>

      <button
        onClick={() => navigate('/categories')}
        className="flex flex-col items-center focus:outline-none hover:text-gray-800"
        title="Categories"
      >
        <FaThLarge size={20} />
        <span className="text-xs">Categories</span>
      </button>

      <button
        onClick={() => navigate('/search')}
        className="flex flex-col items-center focus:outline-none hover:text-gray-800"
        title="Search"
      >
        <FaSearch size={20} />
        <span className="text-xs">Search</span>
      </button>

      <button
        onClick={() => navigate('/orders')}
        className="flex flex-col items-center focus:outline-none hover:text-gray-800"
        title="Orders"
      >
        <FaClipboardList size={20} />
        <span className="text-xs">Orders</span>
      </button>

      <button
        onClick={() => navigate('/cart')}
        className="flex flex-col items-center focus:outline-none hover:text-gray-800"
        title="Cart"
      >
        <FaShoppingCart size={20} />
        <span className="text-xs">Cart</span>
      </button>
    </div>
  );
};

export default Footer;
