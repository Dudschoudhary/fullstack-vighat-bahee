import React, { useState, useRef, useEffect } from 'react';
import { FaKey, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import PasswordChangeModal from './PasswordChangeModal';
import apiService from '../api/apiService';

interface User {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  phone: string;
}

const UserProfile: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (fullname: string): string => {
    if (!fullname) return 'U';
    return fullname.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await apiService.post('/logout');
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isTemporaryPassword');
      
      // Redirect to login
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      localStorage.clear();
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    setIsOpen(false);
    setShowPasswordModal(true);
  };

  if (!user) return null;

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div className="w-8 h-8 bg-indigo-800 rounded-full flex items-center justify-center text-sm font-bold">
            {getInitials(user.fullname)}
          </div>
          <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {getInitials(user.fullname)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user.fullname}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <button
                onClick={handleChangePassword}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700 transition-colors duration-150"
              >
                <FaKey className="w-4 h-4" />
                <span>Change Password</span>
              </button>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-red-600 transition-colors duration-150 disabled:opacity-50"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span>{loading ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <PasswordChangeModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
};

export default UserProfile;