import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SummaryApi from '../common'; // Ensure the correct path to SummaryApi
import { toast } from 'react-toastify';
import displayINRCurrency from '../helpers/displayCurrency'; // Currency formatting helper
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'; // Import the cart icon

const SubCategory = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ subCategories: [], products: [] });
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(SummaryApi.getSubcategories(categoryName).url);
      const result = await response.json();
      console.log('Fetched Subcategories:', result); // Log fetched data
      if (response.ok && result.success) {
        setData((prevData) => ({ ...prevData, subCategories: result.data }));
      } else {
        throw new Error(result.message || 'Failed to fetch subcategories');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (subcategoryId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(SummaryApi.getProducts(subcategoryId).url);
      const result = await response.json();
      if (response.ok && result.success) {
        setData((prevData) => ({ ...prevData, products: result.data }));
      } else {
        throw new Error(result.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, [categoryName]);

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    fetchProducts(subcategory._id);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (productId, event) => {
    event.stopPropagation(); // Prevents parent click handler
    toast.success('Product added to cart');
    console.log(`Adding product with ID ${productId} to cart`);
  };

  const handleBuyProduct = (productId, event) => {
    event.stopPropagation(); // Prevents parent click handler
    toast.success('Proceeding to checkout');
    navigate(`/checkout/${productId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='p-4'>
      <h2 className='bg-white py-2 px-4 flex justify-between items-center'>{categoryName}</h2>

      {!selectedSubcategory && data.subCategories.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {data.subCategories.map((sub) => (
            <div
              key={sub._id}
              className="flex flex-col items-center border p-4 rounded shadow cursor-pointer"
              onClick={() => handleSubcategoryClick(sub)}
            >
              <h1 className='flex-grow font-bold text-lg text-center'>
                {sub?.image && Array.isArray(sub.image) && sub.image.length > 0 ? (
                  <img
                    src={sub.image[0]}
                    alt={sub.name || 'Unnamed Subcategory'}
                    className='w-full h-auto rounded mb-2'
                    onError={(e) => {
                      e.target.onerror = null;
                      console.log('Primary image failed to load, using fallback image.');
                      e.target.src = 'fallback-image-url.jpg'; // Your fallback image URL
                    }}
                    onLoad={() => console.log(`Loaded image from: ${sub.image[0]}`)}
                  />
                ) : (
                  <div className='w-full h-auto rounded mb-2 bg-gray-300 flex justify-center items-center'>
                    No Image
                  </div>
                )}
                {sub.name || 'Unnamed Subcategory'}
              </h1>
            </div>
          ))}
        </div>
      ) : null}

      {selectedSubcategory && (
        <div className='mt-8'>
          <h3 className='bg-white py-2 px-4 flex justify-between items-center'>
            Products in {selectedSubcategory.name}:
          </h3>
          {data.products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {data.products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white p-4 rounded shadow cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className='w-full'>
                    <div className='w-full h-32 flex justify-center items-center'>
                      {product?.productImage && Array.isArray(product.productImage) && product.productImage.length > 0 ? (
                        <img
                          src={product.productImage[0]}
                          className='object-fill h-full'
                          alt={product.productName}
                          onError={(e) => {
                            e.target.onerror = null;
                            console.log('Product image failed to load, using fallback image.');
                            e.target.src = 'fallback-image-url.jpg'; // Your fallback image URL
                          }}
                          onLoad={() => console.log(`Loaded product image from: ${product.productImage[0]}`)}
                        />
                      ) : (
                        <div className='w-full h-full bg-gray-300 flex justify-center items-center'>
                          No Image
                        </div>
                      )}
                    </div>
                    <h4 className='text-ellipsis line-clamp-2 font-semibold mt-2'>
                      {product.productName}
                    </h4>
                    <div className='my-2'>
                      <p className='font-semibold'>
                        <span className='text-gray-500 line-through mr-2'>
                          {displayINRCurrency(product.price)}
                        </span>
                        {displayINRCurrency(product.sellingPrice)}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 mt-2'>
                    <button
                      className='flex-grow text-sm border border-green-600 rounded px-2 py-1 text-green-600 font-medium hover:bg-green-600 hover:text-white transition-all'
                      onClick={(e) => handleBuyProduct(product._id, e)}
                    >
                      Buy
                    </button>
                    <button
                      className='flex-grow text-sm border border-green-600 rounded px-2 py-1 flex items-center justify-center bg-green-600 text-white hover:text-green-600 hover:bg-white transition-all'
                      onClick={(e) => handleAddToCart(product._id, e)}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className='mr-1' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No products found for this subcategory.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SubCategory;
