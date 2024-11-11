import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SummaryApi from '../common'; // Adjust the path as necessary

// Import category images
import category1Image from '../assets/groceries.jpeg';
import category2Image from '../assets/home-products.jpg';
import category3Image from '../assets/cosmetics.jpeg';
import category4Image from '../assets/food-items.jpeg';
import category5Image from '../assets/pooja-items.jpeg';
import category6Image from '../assets/millets.jpg';
import category7Image from '../assets/cold-pressed-oil.jpg';
import category8Image from '../assets/offers.jpeg';

const Categ = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(SummaryApi.Category.url);
        if (response.data && Array.isArray(response.data.data)) {
          const uniqueCategories = Array.from(new Set(response.data.data.map(c => c.name)))
            .map(name => response.data.data.find(c => c.name === name));
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

  const categoryImages = {
    'Offers': category8Image,
    'மளஂளிகை பொருட்கள்': category1Image,
    'வீட்டு உபயோக பொருட்கள்': category2Image,
    'அழகு சாதன பொருட்கள்': category3Image,
    'உணவு பொருட்கள்': category4Image,
    'பூஜை பொருட்கள்': category5Image,
    'சிறுதானிய பொருட்கள்': category6Image,
    'எண்ணெய்': category7Image,
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4 pb-16">
      {Array.isArray(categories) && categories.length > 0 ? (
        categories.map((category) => (
          <div
            key={category._id}
            className="flex flex-col items-center cursor-pointer border-2 border-gray-300 rounded-md shadow-md p-4 transition-transform transform hover:scale-105"
            onClick={() => handleCategoryClick(category.name)}
          >
            <img
              src={categoryImages[category.name] || category1Image}
              alt={category.name}
              className="w-full max-w-xs h-28 object-cover rounded-md mb-2" // Adjusted height and max width
            />
            <h3 className="text-center text-lg font-semibold">{category.name}</h3>
          </div>
        ))
      ) : (
        <p>No categories available</p>
      )}
    </div>
  );
};

export default Categ;