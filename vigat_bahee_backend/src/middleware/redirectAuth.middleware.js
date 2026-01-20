import jwt from 'jsonwebtoken';

export const redirectIfAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token || 
                  req.headers.authorization?.replace('Bearer ', '') ||
                  req.headers.cookie?.split('token=')[1]?.split(';')[0];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded) {
        // Previously redirected authenticated API clients to /dashboard.
        // No redirect anymore — just continue the request flow.
        return next();
      }
    }
    
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    next();
  }
};

export const redirectIfAuthenticatedHTML = (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded) {
        // Previously redirected HTML requests to /bahee.
        // No redirect — allow rendering to continue (no forced navigation).
        return next();
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};
