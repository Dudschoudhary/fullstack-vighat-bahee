import express from "express";
import jwt from 'jsonwebtoken';
import { 
  loginUser,
  registerUser, 
  forgotPassword, 
  changePassword, 
  logoutUser,
  debugUsers,
  testEmail
} from "../controllers/user.controller.js";
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  const token = req.cookies.token;
  
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.redirect('/dashboard');
    } catch (error) {
    }
  }
  
  res.send(`
    <h2>Login Page</h2>
    <form action="/login" method="POST">
      <input type="email" name="email" placeholder="Email" required><br><br>
      <input type="password" name="password" placeholder="Password" required><br><br>
      <button type="submit">Login</button>
    </form>
  `);
});

router.get('/dashboard', authMiddleware, (req, res) => {
  res.send(`
    <h2>Dashboard</h2>
    <p>Welcome ${req.user.email}!</p>
    <form action="/logout" method="POST">
      <button type="submit">Logout</button>
    </form>
  `);
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);

router.post('/change-password', authMiddleware, changePassword);
router.post('/logout', authMiddleware, logoutUser);

router.get('/debug-users', debugUsers);
router.get('/test-email', testEmail);

export default router;