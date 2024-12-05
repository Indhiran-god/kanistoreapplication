import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SummaryApi from '../common'; // Adjust the path if needed

const Categ = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(SummaryApi.Category.url);
        console.log('API Response:', response.data);

        if (response.data && Array.isArray(response.data.data)) {
          const uniqueCategories = Array.from(
            new Set(response.data.data.map((c) => c.name))
          ).map((name) => response.data.data.find((c) => c.name === name));

          const sortedCategories = uniqueCategories.sort((a, b) => {
            if (a.name === 'Offers') return -1;
            if (b.name === 'Offers') return 1;
            return a.name.localeCompare(b.name);
          });

          setCategories(sortedCategories);
          console.log('Categories:', sortedCategories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  if (loading) {
    return <p>Loading categories...</p>;
  }

  return (
    <div className="p-4 pb-16">
      <div
        className="w-full bg-yellow-300 text-center py-4 text-2xl font-bold rounded-md mb-6 cursor-pointer"
        onClick={() => handleCategoryClick('Offers')}
      >
        Offers
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category._id}
              className="flex flex-col items-center cursor-pointer border border-gray-300 rounded-md shadow-md p-2 transition-transform transform hover:scale-105"
              onClick={() => handleCategoryClick(category.name)}
            >
              {category.categoryImage && category.categoryImage.length > 0 ? (
                <div className={`grid ${getGridClasses(category.categoryImage.length)} gap-1 w-full`}>
                  {category.categoryImage.map((image, index) => (
                    <div key={index} className="relative w-full h-24">
                      <img
                        src={image}
                        alt={`Category ${index}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                  <span>No images available</span>
                </div>
              )}
              <h4 className="mt-2 font-semibold text-base text-center truncate max-w-full">
                {category.name}
              </h4>
            </div>
          ))
        ) : (
          <p>No categories available</p>
        )}
      </div>
    </div>
  );
};

// Helper function to determine grid layout based on the number of images
const getGridClasses = (imageCount) => {
  switch (imageCount) {
    case 1:
      return 'grid-cols-1';
    case 2:
      return 'grid-cols-2';
    case 3:
      return 'grid-cols-2 gap-x-2';
    case 4:
      return 'grid-cols-2 gap-x-2 gap-y-2';
    default:
      return 'grid-cols-1';
  }
};

export default Categ;
