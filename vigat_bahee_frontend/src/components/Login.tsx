/* ---------- 1. install Yup ----------
npm i yup
-------------------------------------*/

import React, { useState } from 'react';
import type { ChangeEvent,FormEvent } from 'react';
import vigatBaheeLogo from '../../src/assets/images/vigat-bahee.png';
import { FaRegEye }    from 'react-icons/fa';
import { FaEyeSlash }  from 'react-icons/fa6';
import { FaSignInAlt } from 'react-icons/fa';
import * as yup from 'yup';    

type Mode = 'login' | 'register';

interface LoginData {
  email: string;
  password: string;
}
interface RegisterData extends LoginData {
  name: string;
  address: string;
}
interface FormErrors { [k: string]: string | undefined; }

const loginSchema = yup.object({
  email:    yup.string().required('Email is required').email('Invalid email'),
  password: yup.string().required('Password is required'),
});

const registerSchema = yup.object({
  name:     yup.string().required('Name is required'),
  email:    yup.string().required('Email is required').email('Invalid email'),
  address:  yup.string().required('Address is required'),
  password: yup.string().required('Password is required')
                   .min(6, 'Password must be at least 6 characters'),
});

const Login: React.FC = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [login,    setLogin   ] = useState<LoginData>   ({ email: '', password: '' });
  const [register, setRegister] = useState<RegisterData>({
    name: '', email: '', address: '', password: '',
  });
  const [errors,   setErrors ] = useState<FormErrors>({});
  const [loading,  setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPwd,  setShowPwd ] = useState(false);

  const clearErr = (f: string) =>
    errors[f] && setErrors(prev => ({ ...prev, [f]: undefined }));

  const handle =
    (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      mode === 'login'
        ? setLogin   (p => ({ ...p, [field]: e.target.value }))
        : setRegister(p => ({ ...p, [field]: e.target.value }));
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
        const e: FormErrors = {};
        err.inner.forEach(i => { if (i.path) e[i.path] = i.message; });
        setErrors(e);
      }
      return false;
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!(await validate())) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    console.log(mode.toUpperCase(), mode === 'login'
      ? { ...login, remember }
      : register);
    setLoading(false);
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
                <button onClick={() => { setMode('register'); setErrors({}); }}
                        className="font-medium text-indigo-600 hover:text-indigo-500 focus:underline">
                  create a new account
                </button></>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => { setMode('login'); setErrors({}); }}
                        className="font-medium text-indigo-600 hover:text-indigo-500 focus:underline">
                  Back to sign&nbsp;in
                </button></>
            )}
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-6">
          {mode === 'register' &&
            <Input id="name"   placeholder="Name"          value={register.name}
                   onChange={handle('name')}   error={errors.name}   rounded="t-md" />}
          <Input id="email"  type="email" placeholder="Email address" value={data.email}
                 onChange={handle('email')} error={errors.email}
                 rounded={mode === 'register' ? 'none' : 't-md'} />
          {mode === 'register' &&
            <Textarea id="address" placeholder="Address" value={register.address}
                      onChange={handle('address')} error={errors.address} />}

          <div className="relative">
            <input
              id="password"
              type={showPwd ? 'text' : 'password'}
              placeholder="Password"
              value={data.password}
              onChange={handle('password')}
              className={`block w-full px-3 py-2 border ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              } ${mode==='register'?'rounded-none':'rounded-b-md'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            <button type="button"
                    onClick={() => setShowPwd(s => !s)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                    tabIndex={-1}>
              {showPwd ? <FaEyeSlash className="w-5 h-5"/> : <FaRegEye className="w-5 h-5"/>}
            </button>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          {mode === 'login' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-900">
                <input type="checkbox" checked={remember}
                       onChange={e => setRemember(e.target.checked)}
                       className="h-4 w-4 text-indigo-600 border-gray-300 rounded"/>
                <span>Remember me</span>
              </label>
              <button type="button"
                      onClick={() => console.log('Forgot password')}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:underline">
                Forgot your password?
              </button>
            </div>
          )}

          <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50">
            {loading ? 'Please wait…' : (
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
  error?: string; rounded?: 't-md' | 'b-md' | 'none';
}
const Input: React.FC<FieldProps> = ({ error, rounded='none', ...rest }) => (
  <div>
    <input {...rest}
      className={`block w-full px-3 py-2 border ${error?'border-red-300':'border-gray-300'}
                 ${rounded==='t-md'?'rounded-t-md':rounded==='b-md'?'rounded-b-md':'rounded-none'}
                 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}/>
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);
const Textarea: React.FC<FieldProps> = ({ error, ...rest }) => (
  <div>
    <textarea {...(rest as any)}
      className={`block w-full px-3 py-2 border ${error?'border-red-300':'border-gray-300'}
                 rounded-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}/>
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

export default Login;
