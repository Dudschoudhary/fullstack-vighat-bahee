// src/types/index.ts
export interface User {
    id: string;
    username: string;
    email: string;
    fullname: string;
    phone?: string;
  }
  
  export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    username: string;
    fullname: string;
    email: string;
    phone: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
    isTemporaryPassword?: boolean;
  }
  
  export interface ApiError {
    response?: {
      status: number;
      data: {
        message: string;
      };
    };
    code?: string;
    message: string;
  }
  
  export type Mode = 'login' | 'register' | 'forgot-password';
  
  export interface FormErrors { 
    [key: string]: string | undefined; 
  }
  