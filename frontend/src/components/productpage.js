import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import SummaryApi from '../common'; // Ensure the correct path to SummaryApi
import displayINRCurrency from '../helpers/displayCurrency';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const ProductPage = () => {
  const { id } = useParams(); // Get product ID from URL parameters
  const navigate = useNavigate();
  const [data, setData] = useState(null); // Initially null for better checks
  const [relatedProducts, setRelatedProducts] = useState([]); // State for related products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // For tracking errors
  const [activeImage, setActiveImage] = useState("");
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 });
  const [zoomImage, setZoomImage] = useState(false);
  const { fetchUserAddToCart } = useContext(Context);

  // Fetch product details from API
  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null); // Reset error when fetching begins
    try {
      const response = await fetch(SummaryApi.getProductDetails(id).url, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json(); // Get more details about the error
        throw new Error(`Error: ${response.status} ${errorResponse.message || response.statusText}`);
      }

      const dataResponse = await response.json();
      if (dataResponse?.data) {
        setData(dataResponse.data);
        setActiveImage(dataResponse.data.productImage[0]); // Set first image as active
        
        // Fetch related products using the subcategory ID
        fetchRelatedProducts(dataResponse.data.subcategoryId); // Ensure this is the correct property
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch related products based on the subcategory ID
  const fetchRelatedProducts = async (subcategoryId) => {
    try {
      const response = await fetch(SummaryApi.getRelatedProducts(subcategoryId).url, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Error: ${response.status} ${errorResponse.message || response.statusText}`);
      }

      const dataResponse = await response.json();
      console.log("Related Products Response:", dataResponse); // Log the response to check its structure

      if (dataResponse?.products) {
        setRelatedProducts(dataResponse.products); // Assuming the API returns an object with a 'products' array
      } else {
        throw new Error("No related products found");
      }
    } catch (error) {
      console.error("Failed to fetch related products:", error);
    }
  };

  // Fetch product details when the component mounts
  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  // Handle image zoom
  const handleZoomImage = useCallback((e) => {
    setZoomImage(true);
    const { left, top, width, height } = e.target.getBoundingClientRect();

    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    setZoomImageCoordinate({ x, y });
  }, []);

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

  // Handle Add to Cart functionality
  const handleAddToCart = async (e, productId) => {
    try {
      await addToCart(e, productId);
      fetchUserAddToCart(); // Refresh cart
    } catch (err) {
      console.error("Failed to add product to cart:", err);
    }
  };

  // Handle Buy Product and navigate to cart
  const handleBuyProduct = async (e, productId) => {
    try {
      await addToCart(e, productId);
      fetchUserAddToCart(); // Refresh cart
      navigate("/cart");
    } catch (err) {
      console.error("Failed to buy product:", err);
    }
  };

  // Handle mouse entering to change active image
  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error if something goes wrong
  }

  if (!data) {
    return <div>No product details available.</div>; // Handle case where data is missing
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='min-h-[200px] flex flex-col lg:flex-row gap-8'>
        <div className='lg:w-2/5 w-full'>
          <div className='w-full h-[300px] lg:h-[500px] border rounded-md relative overflow-hidden'>
            <img
              src={activeImage}
              className='h-full w-full object-scale-down mix-blend-multiply'
              onMouseMove={handleZoomImage}
              onMouseLeave={handleLeaveImageZoom}
              alt='Product Image'
            />
            {zoomImage && (
              <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center pointer-events-none">
                <div
                  className="absolute w-2/5 h-3/5 bg-no-repeat bg-contain"
                  style={{
                    backgroundImage: `url(${activeImage})`,
                    backgroundSize: '200%', // This enlarges the image
                    backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`,
                  }}
                />
              </div>
            )}
          </div>

          <div className='flex gap-4 mt-6'>
            {data.productImage.map((image, idx) => (
              <div
                key={idx}
                className='w-16 h-16 border rounded overflow-hidden cursor-pointer'
                onMouseEnter={() => handleMouseEnterProduct(image)}
              >
                <img src={image} className='h-full object-scale-down' alt={`Thumbnail ${idx}`} />
              </div>
            ))}
          </div>
        </div>

        <div className='lg:w-3/5 w-full'>
          <h2 className='text-xl font-semibold'>{data.productName}</h2>
          <p>{data.brandName}</p>

          <p className='mt-4 text-sm text-gray-400'>M.R.P: {displayINRCurrency(data.price)}</p>
          <p className='text-xl text-green-600 font-semibold'>{displayINRCurrency(data.sellingPrice)}</p>

          <p className='text-sm text-gray-500'>{data.description}</p>

          <div className='flex gap-4 mt-6'>
            <button
              className='text-sm border border-green-600 rounded px-4 py-2 text-green-600 font-medium hover:bg-green-600 hover:text-white transition-all'
              onClick={(e) => handleBuyProduct(e, data._id)}
            >
              Buy
            </button>
            <button
              className='flex items-center justify-center border border-green-600 rounded px-2 py-2 bg-green-600 text-white font-medium hover:text-green-600 hover:bg-white transition-all'
              onClick={(e) => handleAddToCart(e, data._id)}
            >
              <FontAwesomeIcon icon={faShoppingCart} className='mr-1' />
          
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className='mt-8'>
        <h3 className='text-lg font-semibold'>Related Products</h3>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
          {relatedProducts.map((product) => (
            <div key={product._id} className='border rounded-md p-2' onClick={() => navigate(`/product/${product._id}`)}>
              <img src={product.productImage[0]} className='w-full h-40 object-cover' alt={product.productName} />
              <h4 className='mt-2 text-sm font-medium'>{product.productName}</h4>
              <p className='text-sm text-gray-500'>{displayINRCurrency(product.sellingPrice)}</p>
              <div className='flex gap-4 mt-6'>
              <button
                className='text-sm border border-green-600 rounded px-4 py-2 text-green-600 font-medium hover:bg-green-600 hover:text-white transition-all'
                onClick={(e) => handleBuyProduct(e, product._id)}
              >
                Buy
              </button>
              <button
                className='flex items-center justify-center border border-green-600 rounded px-2 py-2 bg-green-600 text-white font-medium hover:text-green-600 hover:bg-white transition-all'
                onClick={(e) => handleAddToCart(e, product._id)}
              >
                <FontAwesomeIcon icon={faShoppingCart} className='mr-1' />
                
              </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
