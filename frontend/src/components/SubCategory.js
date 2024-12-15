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
      const response = await fetch(SummaryApi.getSubcategories(categoryName).url);
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
      const response = await fetch(SummaryApi.getProducts(subcategoryId).url);
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

  const handleQuantityChange = (productId, quantity) => {
    setSelectedQuantities((prev) => ({ ...prev, [productId]: quantity }));
  };

  const handleAddToCart = (productId, event) => {
    event.stopPropagation();
    toast.success('Product added to cart');
    console.log(`Adding product ${productId} to cart`);
  };

  const handleBuyNow = (productId, event) => {
    event.stopPropagation();
    navigate(`/checkout/${productId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">{categoryName}</h2>

      {!selectedSubcategory && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {data.subCategories.map((sub) => (
            <div
              key={sub._id}
              className="border p-4 rounded shadow cursor-pointer"
              onClick={() => handleSubcategoryClick(sub)}
            >
              <h3 className="font-semibold text-center">{sub.name}</h3>
              <img
                src={sub.images?.[0] || '/default-placeholder-image.jpg'}
                alt={sub.name}
                className="object-cover w-full h-32 rounded"
                onError={(e) => (e.target.src = '/default-placeholder-image.jpg')}
              />
            </div>
          ))}
        </div>
      )}

      {selectedSubcategory && (
        <div>
          <h3 className="mt-4 text-lg font-semibold">
            Products in {selectedSubcategory.name}:
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {data.products.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded shadow cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.productImage?.[0] || '/default-placeholder-image.jpg'}
                  alt={product.productName}
                  className="object-cover w-full h-32 rounded"
                  onError={(e) => (e.target.src = '/default-placeholder-image.jpg')}
                />
                <h4 className="mt-2 font-semibold">{product.productName}</h4>
                <p className="text-gray-600">
                  {displayINRCurrency(product.sellingPrice)}
                </p>
                <select
                  value={selectedQuantities[product._id] || ''}
                  onChange={(e) =>
                    handleQuantityChange(product._id, e.target.value)
                  }
                  className="border rounded mt-2"
                >
                  <option value="" disabled>
                    Select Quantity
                  </option>
                  {product.quantityOptions?.map((option) => (
                    <option key={option.quantity} value={option.quantity}>
                      {option.quantity}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 mt-2">
                  <button
                    className="flex-1 border px-2 py-1 text-green-600 border-green-600 rounded hover:bg-green-600 hover:text-white"
                    onClick={(e) => handleBuyNow(product._id, e)}
                  >
                    Buy Now
                  </button>
                  <button
                    className="flex-1 border px-2 py-1 text-green-600 border-green-600 rounded bg-green-600 text-white hover:bg-white hover:text-green-600"
                    onClick={(e) => handleAddToCart(product._id, e)}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategory;


