import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';
import SummaryApi from '../common'; // Adjust the path as necessary
import bgImage from '../assets/gbks.jpg';

const Home = () => {
  return (
    <div>
      {/* Store Name and Contact Section */}
      <div
        className='bg-cover bg-center text-white py-8 text-center'
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className='font-bold text-2xl mb-4'>சிவா ஸ்டோர்ஸ்</div>
        <p className='text-lg font-semibold'>Contact Us: 9025301089</p>
        <a
          href={`https://wa.me/9025301089`}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center text-gray-200 hover:text-white mt-2'
          title="Contact us on WhatsApp"
        >
          <FaWhatsapp className='mr-2' />
          <span>WhatsApp: 9025301089</span>
        </a>
        <div className='text-sm mt-8 pt-4'>&copy; 2024 Siva Stores. All rights reserved. Premium Quality Products.</div>
      </div>
    </div>
  );
};

export default Home;
