import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import bgImage from '../assets/gbks.jpg';

const Footer = () => {
  const contactNumber = '9025301089';
  const whatsappLink = `https://wa.me/${contactNumber}`;

  return (
    <footer
      className='py-4 bg-cover bg-center text-white'
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className='text-center font-bold text-lg'>
      சிவா ஸ்டோர்ஸ் 
      </div>
      <div className='container mx-auto p-4 flex flex-col items-center justify-center'>
        <p className='text-center font-bold text-lg' title="Premium Quality Products">
          &copy; Premium Quality Products. All rights reserved.
        </p>
        <p className='text-center mt-4'>
        எங்களை தொடர்பு கொள்வதற்கு: <span className='font-semibold'>{contactNumber}</span>
        </p>
        <a
          href={whatsappLink}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center text-gray-200 hover:text-white mt-2'
          title="Contact us on WhatsApp"
        >
          <FaWhatsapp className='mr-2' />
          <span>WhatsApp: {contactNumber}</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
