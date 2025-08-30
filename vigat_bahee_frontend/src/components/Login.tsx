import React, { useState, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import vigatBaheeLogo from '../../src/assets/images/vigat-bahee.png';
import { FaRegEye, FaEyeSlash, FaSignInAlt, FaCheckCircle } from 'react-icons/fa';
import * as yup from 'yup';
import apiService from '../api/apiService.ts';

// Types
type Mode = 'login' | 'register' | 'forgot-password';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  fullname: string;
  email: string;
  phone: string;
  password: string;
}

interface FormErrors { 
  [key: string]: string | undefined; 
}

// Validation schemas
const loginSchema = yup.object({
  email: yup.string().required('Email is required').email('Please enter a valid email'),
  password: yup.string().required('Password is required').min(1, 'Password cannot be empty'),
});

const forgotPasswordSchema = yup.object({
  email: yup.string().required('Email is required').email('Please enter a valid email'),
});

const registerSchema = yup.object({
  username: yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  fullname: yup.string()
    .required('Full name is required')
    .min(3, 'Full name must be at least 3 characters')
    .max(50, 'Full name must not exceed 50 characters'),
  email: yup.string().required('Email is required').email('Please enter a valid email'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10,15}$/, 'Phone number must be 10-15 digits'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const Login: React.FC = () => {
  // State management
  const [mode, setMode] = useState<Mode>('login');
  const [login, setLogin] = useState<LoginData>({ email: '', password: '' });
  const [register, setRegister] = useState<RegisterData>({
    username: '', fullname: '', email: '', phone: '', password: '',
  });
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Clear messages function
  const clearMessages = useCallback(() => {
    setApiError('');
    setSuccessMessage('');
  }, []);

  // Clear specific field error
  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => ({ ...prev, [field]: undefined }));
    clearMessages();
  }, [clearMessages]);

  // Handle input changes
  const handleInputChange = useCallback((field: string) => 
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      if (mode === 'login') {
        setLogin(prev => ({ ...prev, [field]: value }));
      } else if (mode === 'register') {
        setRegister(prev => ({ ...prev, [field]: value }));
      } else if (mode === 'forgot-password') {
        setForgotEmail(value);
      }
      
      clearFieldError(field);
    }, [mode, clearFieldError]);

  // Validation function
  const validateForm = async (): Promise<boolean> => {
    let data, schema;
    
    if (mode === 'login') {
      data = login;
      schema = loginSchema;
    } else if (mode === 'register') {
      data = register;
      schema = registerSchema;
    } else {
      data = { email: forgotEmail };
      schema = forgotPasswordSchema;
    }

    try {
      await schema.validate(data, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors: FormErrors = {};
        err.inner.forEach(error => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });
        setErrors(validationErrors);
      }
      return false;
    }
  };

  // **LOGIN HANDLER WITH SUCCESS ANIMATION**
  const handleLogin = async (loginData: LoginData) => {
    try {
      console.log('Attempting login with:', { email: loginData.email, remember });
      
      const response = await apiService.post('/login', {
        email: loginData.email.toLowerCase().trim(),
        password: loginData.password,
        remember
      });

      if (!response) {
        throw new Error('No response received from server');
      }

      if (response.token && response.user) {
        // Store authentication data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Check if it's temporary password
        if (response.isTemporaryPassword) {
          localStorage.setItem('isTemporaryPassword', 'true');
          setSuccessMessage('Login successful with temporary password! Please change your password.');
        } else {
          setSuccessMessage('Login successful! Redirecting...');
        }
        
        // Show success animation
        setLoginSuccess(true);
        
        // Redirect after success message
        setTimeout(() => {
          if (response.isTemporaryPassword) {
            window.location.href = '/bahee?changePassword=true';
          } else {
            window.location.href = '/bahee';
          }
        }, 2000);
      } else {
        throw new Error('Invalid response format - missing token or user data');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || '';
        
        switch (status) {
          case 401:
            throw new Error('Invalid email or password. Please check your credentials.');
          case 400:
            throw new Error(message || 'Please fill all required fields correctly.');
          case 429:
            throw new Error('Too many login attempts. Please try again later.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(message || `Login failed with status ${status}`);
        }
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error('Network connection failed. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'Login failed. Please try again.');
      }
    }
  };

  // **REGISTER HANDLER**
  const handleRegister = async (registerData: RegisterData) => {
    try {
      console.log('Attempting registration with:', { 
        username: registerData.username, 
        email: registerData.email 
      });

      const response = await apiService.post('/register', {
        username: registerData.username.toLowerCase().trim(),
        email: registerData.email.toLowerCase().trim(),
        fullname: registerData.fullname.trim(),
        phone: registerData.phone.trim(),
        password: registerData.password,
      });
      
      setSuccessMessage('Registration successful! Please login to continue.');
      
      // Clear form and switch to login mode
      setRegister({
        username: '', fullname: '', email: '', phone: '', password: '',
      });
      
      setTimeout(() => {
        setMode('login');
        setSuccessMessage('');
      }, 2000);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.response?.status === 409) {
        const errorMessage = error.response?.data?.message || '';
        
        if (errorMessage.toLowerCase().includes('email')) {
          setErrors({ email: 'यह email पहले से registered है। कृपया अलग email का उपयोग करें।' });
        } else if (errorMessage.toLowerCase().includes('username')) {
          setErrors({ username: 'यह username पहले से उपयोग में है। कृपया अलग username चुनें।' });
        } else if (errorMessage.toLowerCase().includes('phone')) {
          setErrors({ phone: 'यह phone number पहले से registered है।' });
        } else {
          throw new Error('User already exists. Please use different details.');
        }
      } else {
        const message = error.response?.data?.message || error.message || 'Registration failed';
        throw new Error(message);
      }
    }
  };

  // **FORGOT PASSWORD HANDLER**
  const handleForgotPassword = async (email: string) => {
    try {
      console.log('Attempting forgot password for:', email);
      
      const response = await apiService.post('/forgot-password', {
        email: email.toLowerCase().trim()
      });
      
      setSuccessMessage('Temporary password sent to your email! Please check your inbox.');
      
      setTimeout(() => {
        setMode('login');
        setSuccessMessage('');
      }, 3000);
      
    } catch (error: any) {
      console.error('Forgot password error:', error);
      
      if (error.response?.status === 404) {
        setErrors({ email: 'No account found with this email address.' });
      } else {
        const message = error.response?.data?.message || error.message || 'Failed to send reset email';
        throw new Error(message);
      }
    }
  };

  // Form submission handler
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!(await validateForm())) return;

    setLoading(true);
    clearMessages();
    setErrors({});

    try {
      if (mode === 'login') {
        await handleLogin(login);
      } else if (mode === 'register') {
        await handleRegister(register);
      } else if (mode === 'forgot-password') {
        await handleForgotPassword(forgotEmail);
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Mode switching function
  const switchMode = useCallback((newMode: Mode) => {
    setMode(newMode);
    setErrors({});
    clearMessages();
    setLoginSuccess(false);
    
    if (newMode === 'login') {
      setLogin({ email: '', password: '' });
    } else if (newMode === 'register') {
      setRegister({
        username: '', fullname: '', email: '', phone: '', password: '',
      });
    } else if (newMode === 'forgot-password') {
      setForgotEmail('');
    }
  }, [clearMessages]);

  const getCurrentData = () => {
    if (mode === 'login') return login;
    if (mode === 'register') return register;
    return { email: forgotEmail, password: '' };
  };

  const currentData = getCurrentData();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-md space-y-8">
        <img src={vigatBaheeLogo} alt="Vigat Bahee" className="h-20 rounded-full mx-auto" />

        <header className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {mode === 'login' && 'Sign in to your account'}
            {mode === 'register' && 'Create a new account'}
            {mode === 'forgot-password' && 'Reset your password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'login' && (
              <>Or{' '}
                <button 
                  onClick={() => switchMode('register')}
                  className="font-medium text-indigo-600 hover:text-indigo-500 focus:underline"
                  type="button"
                >
                  create a new account
                </button>
              </>
            )}
            {mode === 'register' && (
              <>Already have an account?{' '}
                <button 
                  onClick={() => switchMode('login')}
                  className="font-medium text-indigo-600 hover:text-indigo-500 focus:underline"
                  type="button"
                >
                  Back to sign in
                </button>
              </>
            )}
            {mode === 'forgot-password' && (
              <>Remember your password?{' '}
                <button 
                  onClick={() => switchMode('login')}
                  className="font-medium text-indigo-600 hover:text-indigo-500 focus:underline"
                  type="button"
                >
                  Back to sign in
                </button>
              </>
            )}
          </p>
        </header>

        {/* Success Message with Animation */}
        {(successMessage || loginSuccess) && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
            {loginSuccess && (
              <FaCheckCircle className="text-green-600 mr-3 text-lg animate-bounce" />
            )}
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {apiError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {mode === 'register' && (
            <>
              <Input 
                id="username" 
                placeholder="Username" 
                value={register.username}
                onChange={handleInputChange('username')} 
                error={errors.username} 
                rounded="t-md"
                autoComplete="username"
              />
              <Input 
                id="fullname" 
                placeholder="Full Name" 
                value={register.fullname}
                onChange={handleInputChange('fullname')} 
                error={errors.fullname} 
                rounded="none"
                autoComplete="name"
              />
            </>
          )}
          
          <Input 
            id="email" 
            type="email" 
            placeholder="Email address" 
            value={currentData.email}
            onChange={handleInputChange('email')} 
            error={errors.email}
            rounded={mode === 'register' ? 'none' : 't-md'}
            autoComplete="email"
          />
          
          {mode === 'register' && (
            <Input 
              id="phone" 
              type="tel" 
              placeholder="Phone Number (10-15 digits)" 
              value={register.phone}
              onChange={handleInputChange('phone')} 
              error={errors.phone} 
              rounded="none"
              autoComplete="tel"
            />
          )}

          {mode !== 'forgot-password' && (
            <div className="relative">
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                placeholder="Password"
                value={currentData.password}
                onChange={handleInputChange('password')}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className={`block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              <button 
                type="button"
                onClick={() => setShowPwd(prev => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPwd ? <FaEyeSlash className="w-5 h-5"/> : <FaRegEye className="w-5 h-5"/>}
              </button>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-900">
                <input 
                  type="checkbox" 
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <span>Remember me</span>
              </label>
              <button 
                type="button"
                onClick={() => switchMode('forgot-password')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:underline"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Please wait...
              </div>
            ) : (
              <>
                {mode === 'login' && <FaSignInAlt className="mr-2"/>}
                {mode === 'login' && 'Sign in'}
                {mode === 'register' && 'Register'}
                {mode === 'forgot-password' && 'Send Reset Link'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Input component remains same
interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string; 
  rounded?: 't-md' | 'b-md' | 'none';
}

const Input: React.FC<FieldProps> = ({ error, rounded = 'none', className, ...rest }) => (
  <div>
    <input 
      {...rest}
      className={`block w-full px-3 py-2 border ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-300'
      } ${
        rounded === 't-md' ? 'rounded-t-md' : 
        rounded === 'b-md' ? 'rounded-b-md' : 
        'rounded-none'
      } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${className || ''}`}
    />
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

export default Login;