import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown, FaChevronUp, FaKey, FaSignOutAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { ReactTransliterate } from 'react-transliterate';
import 'react-transliterate/dist/index.css';
import baheeLogo from '../assets/images/DF2-1.jpg';
import PasswordChangeModal from './PasswordChangeModal';
import baheeApiService from '../services/baheeApiService';

interface UserData {
  fullname?: string;
  username?: string;
  email?: string;
}

interface BaheeSummary {
  vivah: number;
  muklawa: number;
  odhawani: number;
  mahera: number;
  anya: number;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [baheeSummary, setBaheeSummary] = useState<BaheeSummary>({
    vivah: 0, muklawa: 0, odhawani: 0, mahera: 0, anya: 0
  });
  
  // For "अन्य विगत" custom input
  const [showAnyaInput, setShowAnyaInput] = useState(false);
  const [anyaToggle, setAnyaToggle] = useState(false);
  const [customAnyaName, setCustomAnyaName] = useState('');
  const [anyaNameError, setAnyaNameError] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownDesktopRef = useRef<HTMLDivElement>(null);
  const userDropdownMobileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close all menus helper function
  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setIsUserDropdownOpen(false);
    setShowAnyaInput(false);
    setCustomAnyaName('');
    setAnyaToggle(false);
    setAnyaNameError('');
  };

  // Get user initials (first 2 characters of name)
  const getUserInitials = () => {
    if (userData?.fullname) {
      const names = userData.fullname.trim().split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return userData.fullname.substring(0, 2).toUpperCase();
    }
    if (userData?.username) {
      return userData.username.substring(0, 2).toUpperCase();
    }
    return 'US';
  };

  // Load bahee summary counts
  const loadBaheeSummary = async () => {
    try {
      const response = await baheeApiService.getAllBaheeDetails();
      if (response.success && response.data) {
        const rawData = (response.data as any).baheeDetails_ids || response.data || [];
        
        const summary: BaheeSummary = {
          vivah: 0, muklawa: 0, odhawani: 0, mahera: 0, anya: 0
        };
        
        rawData.forEach((item: any) => {
          const type = (item.baheeType || '').toLowerCase().trim();
          if (type in summary) {
            summary[type as keyof BaheeSummary]++;
          }
        });
        
        setBaheeSummary(summary);
      }
    } catch (error) {
      console.error('Error loading bahee summary:', error);
    }
  };

  // Check login status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!token);
      if (user) {
        try {
          setUserData(JSON.parse(user));
        } catch (e) {
          setUserData(null);
        }
      }
    };
    
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]);

  // Load summary when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && isLoggedIn) {
      loadBaheeSummary();
    }
  }, [isDropdownOpen, isLoggedIn]);

  // Close dropdown when clicking outside - only for desktop
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Skip if it's a touch device or mobile menu is open
      if (isMenuOpen) return;
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setShowAnyaInput(false);
        setCustomAnyaName('');
      }
      if (userDropdownDesktopRef.current && !userDropdownDesktopRef.current.contains(event.target as Node) &&
          userDropdownMobileRef.current && !userDropdownMobileRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    closeAllMenus();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('isTemporaryPassword');
    localStorage.removeItem('baheeDetailsSavedArr');
    setIsLoggedIn(false);
    setUserData(null);
    closeAllMenus();
    window.location.href = '/';
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
    closeAllMenus();
  };

  const handleProtectedNavigation = (path: string, state?: any) => {
    closeAllMenus();
    if (!isLoggedIn) {
      navigate('/login', { state: { from: path } });
    } else {
      navigate(path, { state });
    }
  };

  const getBaheeTypeName = (value: string) => {
    const baheeTypes: { [key: string]: string } = {
      vivah: 'विवाह की विगत',
      muklawa: 'मुकलावा की विगत',
      odhawani: 'ओढावणी की विगत',
      mahera: 'माहेरा की विगत',
      anya: 'अन्य विगत'
    };
    return baheeTypes[value?.toLowerCase()] || value || '';
  };

  // Navigate to new bahee page - common function for both desktop and mobile
  const navigateToBahee = (type: string, typeName: string, uparnetToggle: boolean = false) => {
    // Store state in sessionStorage for reliable navigation
    const navState = {
      baheeType: type,
      baheeTypeName: typeName,
      initialUparnetToggle: uparnetToggle
    };
    sessionStorage.setItem('newBaheeState', JSON.stringify(navState));
    
    // Close all menus
    closeAllMenus();
    
    // Use window.location for full page reload to ensure clean state
    window.location.href = `/new-bahee?type=${type}&t=${Date.now()}`;
  };

  // Desktop click handler
  const handleBaheeTypeClick = (type: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (type === 'anya') {
      setShowAnyaInput(true);
      return;
    }
    
    if (!isLoggedIn) {
      closeAllMenus();
      navigate('/login', { state: { from: '/new-bahee' } });
      return;
    }
    
    navigateToBahee(type, getBaheeTypeName(type), false);
  };

  // Mobile click handler - simplified for touch devices
  const handleMobileBaheeTypeClick = (type: string) => {
    console.log('Mobile click:', type); // Debug log
    
    if (type === 'anya') {
      setShowAnyaInput(true);
      return;
    }
    
    if (!isLoggedIn) {
      closeAllMenus();
      navigate('/login', { state: { from: '/new-bahee' } });
      return;
    }
    
    // Store state first
    const navState = {
      baheeType: type,
      baheeTypeName: getBaheeTypeName(type),
      initialUparnetToggle: false
    };
    sessionStorage.setItem('newBaheeState', JSON.stringify(navState));
    
    // Navigate immediately without closing menus first
    window.location.href = `/new-bahee?type=${type}&t=${Date.now()}`;
  };

  const handleAnyaSubmit = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const typeName = customAnyaName.trim();
    
    // Validate - field is required
    if (!typeName) {
      setAnyaNameError('कृपया विगत का नाम लिखें');
      return;
    }
    
    if (!isLoggedIn) {
      closeAllMenus();
      navigate('/login', { state: { from: '/new-bahee' } });
      return;
    }
    
    // Store state in sessionStorage for reliable navigation
    const navState = {
      baheeType: 'anya',
      baheeTypeName: typeName,
      initialUparnetToggle: anyaToggle,
      customTypeName: typeName
    };
    sessionStorage.setItem('newBaheeState', JSON.stringify(navState));
    
    // Close all menus
    closeAllMenus();
    
    // Navigate
    window.location.href = `/new-bahee?type=anya&t=${Date.now()}`;
  };

  const baheeTypes = [
    { key: 'vivah', label: 'विवाह की विगत', icon: '💒' },
    { key: 'muklawa', label: 'मुकलावा की विगत', icon: '🎊' },
    { key: 'odhawani', label: 'ओढावणी की विगत', icon: '👘' },
    { key: 'mahera', label: 'माहेरा की विगत', icon: '🎁' },
    { key: 'anya', label: 'अन्य विगत', icon: '📝' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // User Dropdown Content Component
  const UserDropdownContent = () => (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100] animate-fadeIn">
      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
            {getUserInitials()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {userData?.fullname || userData?.username || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {userData?.email || ''}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        <button
          onClick={handleChangePassword}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
        >
          <FaKey className="w-4 h-4 text-indigo-600" />
          <span>Change Password</span>
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
        >
          <FaSignOutAlt className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  // Toggle dropdown for नई बही बनाएं
  const toggleBaheeDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      closeAllMenus();
      navigate('/login', { state: { from: '/new-bahee' } });
      return;
    }
    
    setIsDropdownOpen(!isDropdownOpen);
    setShowAnyaInput(false);
    setCustomAnyaName('');
    setAnyaToggle(false);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Compact version for header */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img
                src={baheeLogo}
                alt="विगत बही"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <span className="text-xl font-bold text-red-500 rozhaOne-Regular hidden sm:block">
                विगत बही
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive('/') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>

              {/* नई बही बनाएं Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleBaheeDropdown}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    location.pathname.includes('/new-bahee')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>नई बही बनाएं</span>
                  <FaChevronDown className={`ml-1 w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && isLoggedIn && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                    {/* Bahee Summary Section */}
                    <div className="px-3 py-2 border-b border-gray-100">
                      <h4 className="text-xs font-semibold text-blue-800 mb-2 text-center">बही विवरण सारांश</h4>
                      <div className="grid grid-cols-5 gap-1 text-center">
                        {baheeTypes.map((type) => (
                          <div key={type.key} className="bg-blue-50 rounded p-1">
                            <div className="text-sm font-bold text-blue-600">
                              {baheeSummary[type.key as keyof BaheeSummary]}
                            </div>
                            <div className="text-[9px] text-gray-600 leading-tight">
                              {type.label.replace(' की विगत', '')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bahee Type Options */}
                    <div className="py-1">
                      {baheeTypes.map((type) => (
                        <button
                          key={type.key}
                          onClick={(e) => handleBaheeTypeClick(type.key, e)}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                            type.key === 'anya' && showAnyaInput 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                          }`}
                        >
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                          <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded">
                            {baheeSummary[type.key as keyof BaheeSummary]}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Anya Input Section */}
                    {showAnyaInput && (
                      <div className="px-3 py-3 border-t border-gray-100 bg-gray-50">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">
                          अन्य विगत का प्रकार <span className="text-red-500">*</span>
                        </h4>
                        
                        {/* Custom Name Input with Hindi Transliteration */}
                        <ReactTransliterate
                          value={customAnyaName}
                          onChangeText={(text) => {
                            setCustomAnyaName(text);
                            if (text.trim()) {
                              setAnyaNameError('');
                            }
                          }}
                          lang="hi"
                          placeholder="विगत का नाम लिखें (जैसे: जन्मदिन)"
                          className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-1 ${
                            anyaNameError ? 'border-red-500' : 'border-gray-300'
                          }`}
                          maxOptions={3}
                          showCurrentWordAsLastSuggestion={false}
                        />
                        {anyaNameError && (
                          <p className="text-xs text-red-500 mb-2">{anyaNameError}</p>
                        )}
                        
                        {/* Toggle for Uparnet */}
                        <div className="flex items-center justify-between mb-3 bg-white p-2 rounded border">
                          <span className="text-xs text-gray-600">ऊपर नेत फील्ड दिखाएं</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAnyaToggle(!anyaToggle);
                            }}
                            className="focus:outline-none"
                          >
                            {anyaToggle ? (
                              <FaToggleOn className="w-6 h-6 text-blue-600" />
                            ) : (
                              <FaToggleOff className="w-6 h-6 text-gray-400" />
                            )}
                          </button>
                        </div>
                        
                        {/* Submit Button */}
                        <button
                          onClick={(e) => handleAnyaSubmit(e)}
                          className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                          आगे बढ़ें →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleProtectedNavigation('/existing-bahee')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive('/existing-bahee')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                मौजूदा बही
              </button>

              <button
                onClick={() => handleProtectedNavigation('/my-entries')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive('/my-entries')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                आपकी Entries
              </button>

              <Link
                to="/contact"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive('/contact')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Contact Us
              </Link>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-300 mx-1"></div>

              {/* Auth Buttons */}
              {!isLoggedIn ? (
                <div className="flex items-center space-x-1">
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors whitespace-nowrap"
                  >
                    Login
                  </Link>
                  <Link
                    to="/login"
                    state={{ initMode: 'register' }}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-pink-600 text-white hover:bg-pink-700 transition-colors whitespace-nowrap"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                /* Desktop User Avatar Dropdown */
                <div className="relative" ref={userDropdownDesktopRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {getUserInitials()}
                    </span>
                    {isUserDropdownOpen ? (
                      <FaChevronUp className="w-3 h-3" />
                    ) : (
                      <FaChevronDown className="w-3 h-3" />
                    )}
                  </button>

                  {/* Desktop User Dropdown Menu */}
                  {isUserDropdownOpen && <UserDropdownContent />}
                </div>
              )}
            </nav>

            {/* Mobile/Tablet Menu Button */}
            <div className="xl:hidden flex items-center gap-2">
              {/* Mobile User Avatar - Only show when logged in */}
              {isLoggedIn ? (
                <div className="relative" ref={userDropdownMobileRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {getUserInitials()}
                    </span>
                    {isUserDropdownOpen ? (
                      <FaChevronUp className="w-3 h-3" />
                    ) : (
                      <FaChevronDown className="w-3 h-3" />
                    )}
                  </button>

                  {/* Mobile User Dropdown Menu */}
                  {isUserDropdownOpen && <UserDropdownContent />}
                </div>
              ) : (
                /* Mobile Login/SignUp Buttons - Show when not logged in */
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 rounded-md text-sm font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/login"
                    state={{ initMode: 'register' }}
                    className="px-3 py-1.5 rounded-md text-sm font-medium bg-pink-600 text-white hover:bg-pink-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Navigation */}
          {isMenuOpen && (
            <div className="xl:hidden py-4 border-t border-gray-200 animate-slideDown">
              <div className="flex flex-col space-y-1">
                <Link
                  to="/"
                  onClick={() => closeAllMenus()}
                  className={`px-4 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive('/') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Home
                </Link>

                {/* Mobile Dropdown for नई बही बनाएं */}
                <div className="px-4 py-2">
                  <button
                    onClick={toggleBaheeDropdown}
                    className="flex items-center justify-between w-full py-2 text-base font-medium text-gray-700"
                  >
                    <span>नई बही बनाएं</span>
                    {isDropdownOpen ? (
                      <FaChevronUp className="w-4 h-4" />
                    ) : (
                      <FaChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  
                  {isDropdownOpen && isLoggedIn && (
                    <div className="mt-2 space-y-2">
                      {/* Mobile Bahee Summary */}
                      <div className="bg-blue-50 rounded-lg p-3">
                        <h4 className="text-xs font-semibold text-blue-800 mb-2 text-center">बही विवरण सारांश</h4>
                        <div className="grid grid-cols-5 gap-1 text-center">
                          {baheeTypes.map((type) => (
                            <div key={type.key} className="bg-white rounded p-1">
                              <div className="text-sm font-bold text-blue-600">
                                {baheeSummary[type.key as keyof BaheeSummary]}
                              </div>
                              <div className="text-[8px] text-gray-600 leading-tight">
                                {type.label.replace(' की विगत', '')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mobile Bahee Type Options */}
                      <div className="ml-2 space-y-1 border-l-2 border-blue-200 pl-4">
                        {baheeTypes.map((type) => (
                          <button
                            key={type.key}
                            onClick={() => handleMobileBaheeTypeClick(type.key)}
                            className={`w-full text-left py-3 px-2 text-sm transition-colors flex items-center gap-2 rounded-md active:bg-blue-100 ${
                              type.key === 'anya' && showAnyaInput 
                                ? 'text-blue-700 font-medium bg-blue-50' 
                                : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span className="flex-1">{type.label}</span>
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                              {baheeSummary[type.key as keyof BaheeSummary]}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Mobile Anya Input Section */}
                      {showAnyaInput && (
                        <div className="bg-gray-50 rounded-lg p-3 ml-2">
                          <h4 className="text-xs font-semibold text-gray-700 mb-2">
                            अन्य विगत का प्रकार <span className="text-red-500">*</span>
                          </h4>
                          
                          <ReactTransliterate
                            value={customAnyaName}
                            onChangeText={(text) => {
                              setCustomAnyaName(text);
                              if (text.trim()) {
                                setAnyaNameError('');
                              }
                            }}
                            lang="hi"
                            placeholder="विगत का नाम लिखें"
                            className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1 ${
                              anyaNameError ? 'border-red-500' : 'border-gray-300'
                            }`}
                            maxOptions={3}
                            showCurrentWordAsLastSuggestion={false}
                          />
                          {anyaNameError && (
                            <p className="text-xs text-red-500 mb-2">{anyaNameError}</p>
                          )}
                          
                          <div className="flex items-center justify-between mb-3 bg-white p-2 rounded border">
                            <span className="text-xs text-gray-600">ऊपर नेत फील्ड</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAnyaToggle(!anyaToggle);
                              }}
                              className="focus:outline-none"
                            >
                              {anyaToggle ? (
                                <FaToggleOn className="w-6 h-6 text-blue-600" />
                              ) : (
                                <FaToggleOff className="w-6 h-6 text-gray-400" />
                              )}
                            </button>
                          </div>
                          
                          <button
                            onClick={(e) => handleAnyaSubmit(e)}
                            className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 active:bg-blue-800"
                          >
                            आगे बढ़ें →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleProtectedNavigation('/existing-bahee')}
                  className={`px-4 py-3 rounded-md text-base font-medium transition-colors text-left ${
                    isActive('/existing-bahee') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  मौजूदा बही
                </button>

                <button
                  onClick={() => handleProtectedNavigation('/my-entries')}
                  className={`px-4 py-3 rounded-md text-base font-medium transition-colors text-left ${
                    isActive('/my-entries') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  आपकी Entries
                </button>

                <Link
                  to="/contact"
                  onClick={() => closeAllMenus()}
                  className={`px-4 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive('/contact') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideDown {
            from { opacity: 0; max-height: 0; }
            to { opacity: 1; max-height: 1000px; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
          .animate-slideDown {
            animation: slideDown 0.3s ease-out;
          }
        `}</style>
      </header>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <PasswordChangeModal 
          isOpen={showPasswordModal} 
          onClose={() => setShowPasswordModal(false)} 
        />
      )}
    </>
  );
};

export default Header;
