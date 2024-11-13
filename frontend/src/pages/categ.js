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
    <div className="p-4 pb-16">
      {/* Offers box */}
      <div
        className="w-full bg-yellow-300 text-center py-4 text-2xl font-bold rounded-md mb-6 cursor-pointer"
        onClick={() => handleCategoryClick('Offers')}
      >
        Offers
      </div>
      
      {/* Categories grid */}
      <div className="grid grid-cols-3 gap-4">
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category._id}
              className="flex flex-col items-center cursor-pointer border-2 border-gray-300 rounded-md shadow-md p-4 transition-transform transform hover:scale-105"
              onClick={() => handleCategoryClick(category.name)}
            >
              {/* Render the image or a placeholder */}
              {category.image && category.image.length > 0 ? (
                <img
                  src={category.image[0]} // Assuming `category.image` is an array and the first item is the image URL
                  alt={category.name || 'Unnamed Category'}
                  className="w-full max-w-xs h-28 object-cover rounded-md mb-2"
                />
              ) : (
                <div className="w-full max-w-xs h-28 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                  <span>No Image</span>
                </div>
              )}
              <h3 className="text-center text-lg font-semibold">{category.name}</h3>
            </div>
          ))
        ) : (
          <p>No categories available</p>
        )}
      </div>
    </div>
  );
};

export default Categ;
