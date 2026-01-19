import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info Section */}
          <div className="col-span-1 lg:col-span-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                VIGATBAHEE
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
              डिजिटल विगत बही , शादी-विवाह से लेकर हर शुभ अवसर की। 
              आमजन के नेग-धेग की entries का सीधा समाधान, कागज़ी रजिस्टर से मुक्ति और समय की बचत के साथ। vigatbahi.me
              </p>
            </div>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/duda.ram.choudhary" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              <a 
                href="https://twitter.com/erduds656" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              
              <a 
                href="https://instagram.com/dudaram_choudhary_656" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.73-3.016-1.803-.568-1.074-.568-2.387 0-3.461.568-1.074 1.719-1.803 3.016-1.803s2.448.729 3.016 1.803c.568 1.074.568 2.387 0 3.461-.568 1.074-1.719 1.803-3.016 1.803zm7.119 0c-1.297 0-2.448-.73-3.016-1.803-.568-1.074-.568-2.387 0-3.461.568-1.074 1.719-1.803 3.016-1.803s2.448.729 3.016 1.803c.568 1.074.568 2.387 0 3.461-.568 1.074-1.719 1.803-3.016 1.803z"/>
                </svg>
              </a>
              
              <a 
                href="https://linkedin.com/company/duda.ram.choudhary"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about-us" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages (Google Ads Required) */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Legal & Policies</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms-and-conditions" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link 
                  to="/dmca-policy" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  DMCA Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-gray-300 text-sm">
                    Baldev Nagar,<br />
                    Jodhpur, Rajasthan 342003<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a 
                  href="tel:+91XXXXXXXXXX" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  +91-9468650730
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a 
                  href="mailto:vigatbahi@gmail.com" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  vigatbahi@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center lg:max-w-none lg:text-left">
            <h3 className="text-lg font-semibold text-white mb-4">
             Newsletter
            </h3>
            <p className="text-gray-300 text-sm mb-4">
            Join our subscribers list to get the latest news, updates and special offers directly in your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200 font-medium"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-2">
              We respect your privacy. Read our{' '}
              <Link to="/privacy-policy" className="text-blue-400 hover:text-blue-300">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <p>
              Copyright © {currentYear} vigat bahee - All Rights Reserved
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-xs text-gray-400">
              <Link 
                to="/privacy-policy" 
                className="hover:text-white transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link 
                to="/terms-and-conditions" 
                className="hover:text-white transition-colors duration-200"
              >
                Terms
              </Link>
              <Link 
                to="/contact" 
                className="hover:text-white transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Google Ads Disclosure */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              This site uses cookies and Google Ads for personalized advertising. 
              <Link to="/privacy-policy" className="text-blue-400 hover:text-blue-300 ml-1">
                Learn more about our cookie usage
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;