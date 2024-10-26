import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-slate-200 py-4'>
      <div className='text-center font-bold text-lg'>
        KANI STORES
      </div>
      <div className='container mx-auto p-4 flex flex-col items-center justify-center'>
        <p className='text-center font-bold text-lg' title="Premium Quality Products">
          &copy; 2024 Premium Quality Products. All rights reserved.
        </p>
        <ul className='flex flex-wrap justify-center mt-4'>
          <li className='mx-2'>
            <Link to='./pages/terms' className='text-sm text-gray-600 hover:text-gray-900'>
              Terms of Service
            </Link>
          </li>
          <li className='mx-2'>
            <Link to='/privacy' className='text-sm text-gray-600 hover:text-gray-900'>
              Privacy Policy
            </Link>
          </li>
          <li className='mx-2'>
            <Link to='/contact' className='text-sm text-gray-600 hover:text-gray-900'>
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
