// routes/baheeRoutes.js
import express from 'express';
import {
  personalCreateBaheeEntry,
  getPersonalAllBaheeEntries,
  getPersonalBaheeEntriesByHeader,
  personalUpdateBaheeEntry,
  personalDeleteBaheeEntry
} from '../controllers/personalbahee.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js'; // ✅ auth import करो


const router = express.Router();

// ✅ अब हर personalbahee route पर auth लगेगा
router.post('/personalbahee', authMiddleware, personalCreateBaheeEntry);
router.get('/personalbahee', authMiddleware, getPersonalAllBaheeEntries);
router.get('/personalbahee/:baheeType/:headerName', authMiddleware, getPersonalBaheeEntriesByHeader);
router.put('/personalbahee/:id', authMiddleware, personalUpdateBaheeEntry);
router.delete('/personalbahee/:id', authMiddleware, personalDeleteBaheeEntry);

export default router;