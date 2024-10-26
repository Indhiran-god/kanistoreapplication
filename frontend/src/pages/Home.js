import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import Outlet
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

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // Initialize categories as an empty array

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(SummaryApi.Category.url);
        console.log("Fetched categories:", response.data); // Log the API response

        // Check if the response contains the 'data' property
        if (response.data && Array.isArray(response.data.data)) {
          // Create unique categories based on their names
          const uniqueCategories = Array.from(new Set(response.data.data.map(c => c.name)))
            .map(name => response.data.data.find(c => c.name === name));

          console.log("Unique categories before setting state:", uniqueCategories); // Log unique categories
          setCategories(uniqueCategories); // Set unique categories
        } else {
          console.error("Categories is not an array:", response.data);
          setCategories([]); // Set to empty array if not an array
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    console.log("Navigating to subcategory of:", categoryName);
    navigate(`/category/${categoryName}`); // Navigate to the subcategory route
  };

  // Map category names to images
  const categoryImages = {
    'மளஂளிகை பொருட்கள்': category1Image,
    'வீட்டு உபயோக பொருட்கள்': category2Image,
    'அழகு சாதன பொருட்கள்': category3Image,
    'உணவு பொருட்கள்': category4Image,
    'பூஜை பொருட்கள்': category5Image,
    'சிறுதானிய பொருட்கள்': category6Image,
    'எண்ணெய்': category7Image,
    'Offers': category8Image,
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 p-4">
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category._id} // Use the unique category ID as the key
              className="flex flex-col items-center cursor-pointer border-2 border-gray-300 rounded-md shadow-md p-4 transition-transform transform hover:scale-105"
              onClick={() => handleCategoryClick(category.name)}
            >
              <img
                src={categoryImages[category.name] || category1Image} // Use image from mapping or fallback
                alt={category.name}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h3 className="text-center text-lg font-semibold">{category.name}</h3>
            </div>
          ))
        ) : (
          <p>No categories available</p> // Fallback if categories is empty
        )}
      </div>
      {/* This will render nested routes if any */}
    </div>
  );
};

export default Home;
