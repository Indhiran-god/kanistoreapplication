import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import displayINRCurrency from '../helpers/displayCurrency';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const SubCategory = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ subCategories: [], products: [] });
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedQuantities, setSelectedQuantities] = useState({});

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const url = SummaryApi.getSubcategories(categoryName).url;
      const response = await fetch(url);
      const result = await response.json();

      if (response.ok && result.success) {
        setData((prev) => ({ ...prev, subCategories: result.data }));
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
    try {
      setLoading(true);
      const url = SummaryApi.getProducts(subcategoryId).url;
      const response = await fetch(url);
      const result = await response.json();

      if (response.ok && result.success) {
        setData((prev) => ({ ...prev, products: result.data }));
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

  const handleQuantityChange = (product, event) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [product._id]: event.target.value,
    }));
  };

  const handleBuyProduct = (productId, event) => {
    event.stopPropagation();
    toast.success(`Moving to Payment page`);
    // Add buy product logic here
  };

  const handleAddToCart = (productId, event) => {
    event.stopPropagation();
    toast.success(`Product added to cart!`);
    // Add add-to-cart logic here
  };

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 min-h-screen flex flex-col">
      <h2 className="text-lg font-semibold">{categoryName}</h2>

      {!selectedSubcategory && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {data.subCategories.map((sub) => (
            <div
              key={sub._id}
              className="flex flex-col items-center cursor-pointer border border-gray-300 rounded-md shadow-md p-2 transition-transform transform hover:scale-105"
              onClick={() => handleSubcategoryClick(sub)}
            >
              {sub.images && sub.images.length > 0 ? (
                <div
                  className={`grid ${getGridClasses(sub.images.length)} gap-1 w-full`}
                >
                  {sub.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-full aspect-square overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`Subcategory ${index}`}
                        className="w-full h-full object-cover object-center rounded"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full aspect-square bg-gray-200 rounded flex items-center justify-center">
                  <span>No images available</span>
                </div>
              )}
              <h4 className="mt-2 font-semibold text-base text-center break-words">
                {sub.name}
              </h4>
            </div>
          ))}
        </div>
      )}

      {selectedSubcategory && (
        <div className="mt-8">
          <h3 className="bg-white py-2 px-4 flex justify-between items-center">
            Products in {selectedSubcategory.name}:
          </h3>
          {data.products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {data.products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white p-4 rounded shadow cursor-pointer"
                >
                  <div className="w-full">
                    <div className="w-full h-32 flex justify-center items-center">
                      {product?.productImage && Array.isArray(product.productImage) && product.productImage.length > 0 ? (
                        <img
                          onClick={() => handleProductClick(product)}
                          src={product.productImage[0]}
                          className="object-fill h-full"
                          alt={product.productName}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'fallback-image-url.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex justify-center items-center">
                          No Image
                        </div>
                      )}
                    </div>
                    <h4 className="text-ellipsis line-clamp-2 font-semibold mt-2">
                      {product.productName}
                    </h4>
                    <div className="my-2">
                      {product.price && (
                        <p className="font-semibold">
                          <span className="text-gray-500 line-through mr-2">
                            {displayINRCurrency(product.price)}
                          </span>
                        </p>
                      )}
                    </div>
                    {product.quantityOptions && product.quantityOptions.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <select
                          value={selectedQuantities[product._id] || product.quantityOptions[0].quantity}
                          onChange={(e) => handleQuantityChange(product, e)}
                          className="border rounded px-2 py-1"
                        >
                          {product.quantityOptions.map((option) => (
                            <option key={option.quantity} value={option.quantity}>
                              {option.quantity} - {displayINRCurrency(option.price)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        className="flex-grow text-sm border border-green-600 rounded px-2 py-1 text-green-600 font-medium hover:bg-green-600 hover:text-white transition-all"
                        onClick={(e) => handleBuyProduct(product._id, e)}
                      >
                        Buy
                      </button>
                      <button
                        className="flex-grow text-sm border border-green-600 rounded px-2 py-1 flex items-center justify-center bg-green-600 text-white hover:text-green-600 hover:bg-white transition-all"
                        onClick={(e) => handleAddToCart(product._id, e)}
                      >
                        <FontAwesomeIcon icon={faShoppingCart} className="mr-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No products found for this subcategory.</p>
          )}
        </div>
      )}

      <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
        <p>© 2025 Siva Stores. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SubCategory;


