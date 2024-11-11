import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SummaryApi from '../common'; // Adjust the path as necessary

const Categ = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(SummaryApi.Category.url);
        if (response.data && Array.isArray(response.data.data)) {
          // Remove duplicate categories by name
          const uniqueCategories = Array.from(new Set(response.data.data.map(c => c.name)))
            .map(name => response.data.data.find(c => c.name === name));
          
          // Sort categories and make sure 'Offers' appears first
          const sortedCategories = uniqueCategories.sort((a, b) => {
            if (a.name === 'Offers') return -1;
            if (b.name === 'Offers') return 1;
            return 0;
          });
          
          setCategories(sortedCategories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4 pb-16">
      {Array.isArray(categories) && categories.length > 0 ? (
        categories.map((category) => {
          // Log category image URL for debugging
          console.log('Category Image URL:', category.image);

          // If image URL is relative, append base URL from the API server
          const fullImageUrl = category.image ? category.image : '/images/default-image-url.jpg';

          return (
            <div
              key={category._id}
              className="flex flex-col items-center cursor-pointer border-2 border-gray-300 rounded-md shadow-md p-4 transition-transform transform hover:scale-105"
              onClick={() => handleCategoryClick(category.name)}
            >
              <img
                src={fullImageUrl} // Use the image URL directly, assuming it's absolute from the API
                alt={category.name}
                className="w-full max-w-xs h-28 object-cover rounded-md mb-2"
              />
              <h3 className="text-center text-lg font-semibold">{category.name}</h3>
            </div>
          );
        })
      ) : (
        <p>No categories available</p>
      )}
    </div>
  );
};

export default Categ;
