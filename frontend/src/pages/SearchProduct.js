import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SummaryApi from '../common';

const SearchProduct = () => {
    const query = useLocation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    console.log("query", query.search);

    const fetchProduct = async () => {
        setLoading(true);
        const response = await fetch(SummaryApi.searchProduct.url + query.search);
        const dataResponse = await response.json();
        setLoading(false);
        setData(dataResponse.data);
    };

    useEffect(() => {
        fetchProduct();
    }, [query]);

    return (
        <div className='container mx-auto p-4'>
            {loading && (
                <p className='text-lg text-center'>Loading ...</p>
            )}

            <p className='text-lg font-semibold my-3'>Search Results: {data.length}</p>

            {data.length === 0 && !loading && (
                <p className='bg-white text-lg text-center p-4'>No Data Found....</p>
            )}

            {/* Removed VerticalCard component */}
            {!loading && data.length > 0 && (
                <div>
                    {data.map((item, index) => (
                        <div key={index} className="border p-4 mb-4">
                            {/* Displaying each item in a simple format */}
                            <h2 className='font-bold'>{item.name}</h2>
                            <p>{item.description}</p>
                            {/* Add other item properties as needed */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchProduct;
