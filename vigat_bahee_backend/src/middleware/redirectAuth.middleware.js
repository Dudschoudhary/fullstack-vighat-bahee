import jwt from 'jsonwebtoken';

export const redirectIfAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token || 
                  req.headers.authorization?.replace('Bearer ', '') ||
                  req.headers.cookie?.split('token=')[1]?.split(';')[0];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        return res.status(302).json({ 
          success: false, 
          message: 'Already logged in',
          redirect: '/dashboard' 
        });
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        return res.redirect('/bahee');
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};
