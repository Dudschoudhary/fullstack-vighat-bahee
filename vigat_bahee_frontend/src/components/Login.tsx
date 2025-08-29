import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import vigatBaheeLogo from '../../src/assets/images/vigat-bahee.png';
import { FaRegEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa6';
import { FaSignInAlt } from 'react-icons/fa';
import * as yup from 'yup';
import apiService from '../api/apiService.ts';

type Mode = 'login' | 'register';

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

interface FormErrors { [k: string]: string | undefined; }

const loginSchema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup.string().required('Password is required'),
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
  email: yup.string()
    .required('Email is required')
    .email('Invalid email'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10,15}$/, 'Phone number must be 10-15 digits'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const Login: React.FC = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [login, setLogin] = useState<LoginData>({ email: '', password: '' });
  const [register, setRegister] = useState<RegisterData>({
    username: '', fullname: '', email: '', phone: '', password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const clearMessages = () => {
    setApiError('');
    setSuccessMessage('');
  };

  const clearErr = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    clearMessages();
  };

  const handle = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (mode === 'login') {
      setLogin(prev => ({ ...prev, [field]: value }));
    } else {
      setRegister(prev => ({ ...prev, [field]: value }));
    }
    
    clearErr(field);
  };

  const validate = async (): Promise<boolean> => {
    const data = mode === 'login' ? login : register;
    const schema = mode === 'login' ? loginSchema : registerSchema;

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

  const handleLogin = async (loginData: LoginData) => {
    try {
      const response = await apiService.post('/login', {
        ...loginData,
        remember
      });

      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        setSuccessMessage('Login successful! Redirecting...');
        
        // Redirect or update app state
        setTimeout(() => {
          // Handle successful login (e.g., redirect to dashboard)
          window.location.href = '/bahee';
        }, 1500);
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Login failed. Please try again.'
      );
    }
  };

  const handleRegister = async (registerData: RegisterData) => {
    try {
      const response = await apiService.post('/register', registerData);
      
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
      // Handle 409 status code (conflict - user already exists)
      if (error.response?.status === 409) {
        const errorData = error.response?.data;
        const errorMessage = errorData?.message || '';
        
        console.log('409 Error Data:', errorData); // For debugging
        
        // Check different types of conflicts
        if (errorMessage.toLowerCase().includes('email') || errorData?.field === 'email') {
          setErrors({ email: 'यह email पहले से registered है। कृपया अलग email का उपयोग करें या login करें।' });
          return;
        } else if (errorMessage.toLowerCase().includes('username') || errorData?.field === 'username') {
          setErrors({ username: 'यह username पहले से उपयोग में है। कृपया अलग username चुनें।' });
          return;
        } else if (errorMessage.toLowerCase().includes('phone') || errorData?.field === 'phone') {
          setErrors({ phone: 'यह phone number पहले से registered है।' });
          return;
        } else {
          // Generic conflict message
          setApiError('User पहले से मौजूद है। कृपया अलग details का उपयोग करें।');
          return;
        }
      }
      
      // For other errors (400, 500, etc.)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Registration failed. Please try again.'
      );
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!(await validate())) return;

    setLoading(true);
    clearMessages();
    // Clear any existing errors when submitting
    setErrors({});

    try {
      if (mode === 'login') {
        await handleLogin(login);
      } else {
        await handleRegister(register);
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setErrors({});
    clearMessages();
    
    // Clear form data when switching modes
    if (newMode === 'login') {
      setLogin({ email: '', password: '' });
    } else {
      setRegister({
        username: '', fullname: '', email: '', phone: '', password: '',
      });
    }
  };

  const data = mode === 'login' ? login : register;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-md space-y-8">
        <img src={vigatBaheeLogo} alt="Vigat Bahee" className="h-20 rounded-full mx-auto" />

        <header className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'login' ? (
              <>Or{' '}
                <button 
                  onClick={() => switchMode('register')}
                  className="font-medium text-indigo-600 hover:text-indigo-500 focus:underline"
                  type="button"
                >
                  create a new account
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button 
                  onClick={() => switchMode('login')}
                  className="font-medium text-indigo-600 hover:text-indigo-500 focus:underline"
                  type="button"
                >
                  Back to sign&nbsp;in
                </button>
              </>
            )}
          </p>
        </header>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
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
                onChange={handle('username')} 
                error={errors.username} 
                rounded="t-md"
                autoComplete="username"
              />
              <Input 
                id="fullname" 
                placeholder="Full Name" 
                value={register.fullname}
                onChange={handle('fullname')} 
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
            value={data.email}
            onChange={handle('email')} 
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
              onChange={handle('phone')} 
              error={errors.phone} 
              rounded="none"
              autoComplete="tel"
            />
          )}

          <div className="relative">
            <input
              id="password"
              type={showPwd ? 'text' : 'password'}
              placeholder="Password"
              value={data.password}
              onChange={handle('password')}
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
              aria-label={showPwd ? 'Hide password' : 'Show password'}
            >
              {showPwd ? <FaEyeSlash className="w-5 h-5"/> : <FaRegEye className="w-5 h-5"/>}
            </button>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

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
                onClick={() => console.log('Forgot password clicked')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:underline"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Please wait...
              </div>
            ) : (
              <>
                {mode === 'login' && <FaSignInAlt className="mr-2"/>}
                {mode === 'login' ? 'Sign in' : 'Register'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

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
      } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className || ''}`}
    />
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

export default Login;