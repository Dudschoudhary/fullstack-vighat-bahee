// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import Loader from '../common/Loader';

// Define user type (make it more specific than 'any')
interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  phone?: string;
}

// Define the shape of your context
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData?: User) => void;
  logout: () => void;
  loading: boolean;
}

// Create the context with undefined as default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Props type for the AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // if (loading) {
  //   return <Loader fullScreen text="Loading..." size="large" />;
  // }


  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token) {
          setIsAuthenticated(true);
          if (userData) {
            const parsedUser = JSON.parse(userData) as User;
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error('Failed to parse auth data:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (token: string, userData?: User) => {
    try {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to store auth data:', error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isTemporaryPassword');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
