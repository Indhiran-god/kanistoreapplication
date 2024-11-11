import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';
import SummaryApi from '../common'; // Adjust the path if necessary
import bgImage from '../assets/gbks.jpg';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        const response = await axios.get(SummaryApi.getAllProducts.url); // Ensure SummaryApi has getAllProducts defined
        // Separate products and offers
        const regularProducts = response.data.products.filter(
          (product) => product.category !== 'Offers'
        );
        const offerProducts = response.data.products.filter(
          (product) => product.category === 'Offers'
        );
        setProducts(regularProducts);
        setOffers(offerProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div>
      {/* Products Section */}
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
              onClick={() => handleProductClick(product._id)}
            >
              <img
                src={product.image || 'https://via.placeholder.com/150'}
                alt={product.name}
                className="w-full h-40 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-500">{product.description}</p>
              <p className="text-green-600 font-bold mt-2">
                ₹{product.price}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Offers Section */}
      {offers.length > 0 && (
        <div className="container mx-auto py-8 px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Offers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {offers.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                onClick={() => handleProductClick(product._id)}
              >
                <img
                  src={product.image || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-4 rounded"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-500">{product.description}</p>
                <p className="text-red-600 font-bold mt-2">
                  Special Price: ₹{product.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Store Name and Contact Section */}
      <div
        className="bg-cover bg-center text-white py-8 text-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="font-bold text-2xl mb-4">சிவா ஸ்டோர்ஸ்</div>
        <p className="text-lg font-semibold">Contact Us: 9025301089</p>
        <a
          href={`https://wa.me/9025301089`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-gray-200 hover:text-white mt-2"
          title="Contact us on WhatsApp"
        >
          <FaWhatsapp className="mr-2" />
          <span>WhatsApp: 9025301089</span>
        </a>
        <div className="text-sm mt-8 pt-4">
          &copy; 2024 Siva Stores. All rights reserved. Premium Quality Products.
        </div>
      </div>
    </div>
  );
};

export default Home;
