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

  const handleProductImageClick = (productId) => {
    navigate(`/product/${productId}`);
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
    <div className="p-4">
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
        <div>
          <h3 className="mt-4 text-lg font-semibold">
            Products in {selectedSubcategory.name}:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {data.products.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded-md shadow-md cursor-pointer transition-transform transform hover:scale-105"
                onClick={() => handleProductImageClick(product._id)}
              >
                <img
                  src={product.productImage?.[0] || '/default-placeholder-image.jpg'}
                  alt={product.productName}
                  className="object-cover w-full h-32 rounded"
                  onError={(e) => (e.target.src = '/default-placeholder-image.jpg')}
                />
                <h4 className="mt-2 font-semibold">{product.productName}</h4>
                <p className="text-gray-600">
                  {product.mrp && (
                    <div className="text-red-500 line-through">
                      <p className="font-semibold">{displayINRCurrency(product.mrp)}</p>
                    </div>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategory;
