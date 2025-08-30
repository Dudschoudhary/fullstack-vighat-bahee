import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaHome } from 'react-icons/fa';
import baheeLogo from '../assets/images/vigat-bahee.png';

const CustomVigatBaheeLogo = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Always redirect to bahee page for logged-in users
    // This prevents accidental logout
    navigate('/bahee');
  };

  const handleHome = () => {
    navigate('/bahee');
  };

  // Show different button based on current page
  const isOnBaheePage = location.pathname === '/bahee';

  return (
    <div className="w-full mb-6 lg:mb-8">
      {/* Mobile Layout */}
      <div className="flex sm:hidden items-center justify-between mb-4">
        {!isOnBaheePage ? (
          <button
            onClick={handleBack}
            className="p-2.5 bg-white border-2 border-gray-300 rounded-full shadow-md hover:bg-gray-50 hover:border-indigo-300 hover:shadow-lg focus:outline-none focus:ring-3 focus:ring-indigo-200 transition-all duration-300"
            aria-label="बही पर वापस जाएं"
          >
            <FaHome className="text-gray-600 text-base hover:text-indigo-600 transition-colors" />
          </button>
        ) : (
          <div className="w-10 h-10"></div> // Spacer
        )}
        
        <div className="flex-1"></div>
      </div>

      {/* Logo and Title for Mobile */}
      <div className="flex flex-col sm:hidden items-center gap-3">
        <Link 
          to="/bahee" 
          className="block transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 rounded-full"
        >
          <img
            src={baheeLogo}
            alt="Bahee Logo"
            className="w-20 h-20 rounded-full object-cover shadow-lg border-3 border-white"
          />
        </Link>
        
        <h1 className="text-3xl font-medium text-red-500 rozhaOne-Regular text-center drop-shadow-md">
          विगत बही
        </h1>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex relative items-center justify-center">
        {/* Home Button for Desktop */}
        {!isOnBaheePage && (
          <button
            onClick={handleBack}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3 bg-white border-2 border-gray-300 rounded-full shadow-lg hover:bg-gray-50 hover:border-indigo-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-300 ease-in-out group"
            aria-label="होम पर जाएं"
          >
            <FaHome className="text-gray-600 text-lg group-hover:text-indigo-600 transition-colors duration-300" />
          </button>
        )}

        {/* Logo and Title for Desktop */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link 
            to="/bahee" 
            className="block transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300 rounded-full"
          >
            <img
              src={baheeLogo}
              alt="Bahee Logo"
              className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full object-cover shadow-xl border-4 border-white"
            />
          </Link>

          <div className="text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-red-500 rozhaOne-Regular leading-tight drop-shadow-lg">
              विगत बही
            </h1>
            <div className="w-full h-1 bg-gradient-to-r from-red-400 to-red-600 mt-2 rounded-full opacity-70"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVigatBaheeLogo;