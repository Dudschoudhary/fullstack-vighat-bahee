import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import baheeLogo from '../assets/images/DF2-1.jpg';

const CustomVigatBaheeLogo = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Always redirect to bahee page for logged-in users
    // This prevents accidental logout
    navigate('/');
  };



  // Show different button based on current page
  const isOnBaheePage = location.pathname === '/bahee';

  return (
    <div className="w-full mb-4 lg:mb-8">
      {/* 🟢 Mobile Layout - अब same as desktop (side by side) */}
      <div className="sm:hidden flex relative items-center justify-center px-3 pt-2 mt-2">
        {!isOnBaheePage && (
          <button
            onClick={handleBack}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 bg-white border border-gray-300 rounded-full shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
            aria-label="होम पर जाएं"
          >
            <FaHome className="text-gray-600 text-lg" />
          </button>
        )}

        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-full"
          >
            <img
              src={baheeLogo}
              alt="Bahee Logo"
              className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-white"
            />
          </Link>

          <div className="text-left">
            <h1 className="text-2xl font-medium text-red-500 rozhaOne-Regular leading-tight">
              विगत बही
            </h1>
            <div className="w-full h-0.5 bg-gradient-to-r from-red-400 to-red-600 mt-1 rounded-full opacity-70"></div>
          </div>
        </div>
      </div>

      {/* 🟢 Desktop Layout (same structure) */}
      <div className="hidden sm:flex relative items-center justify-center mt-4">
        {!isOnBaheePage && (
          <button
            onClick={handleBack}
            className="absolute left-10 top-1/2 transform -translate-y-1/2 p-3 bg-white border border-gray-300 rounded-full shadow hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all group"
            aria-label="होम पर जाएं"
          >
            <FaHome className="text-gray-600 text-lg group-hover:text-indigo-600 transition-colors" />
          </button>
        )}

        <div className="flex items-center gap-6 lg:gap-8">
          <Link 
            to="/" 
            className="transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300 rounded-full"
          >
            <img
              src={baheeLogo}
              alt="Bahee Logo"
              className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full object-cover shadow-xl border-4 border-white"
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