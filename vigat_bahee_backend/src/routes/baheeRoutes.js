// routes/baheeRoutes.js
import express from 'express';
import {
  createBaheeDetails,
  getAllBaheeDetails,
  getBaheeDetailsByType,
  updateBaheeDetails,
  deleteBaheeDetails,
  createBaheeEntry,
  getAllBaheeEntries,
  getBaheeEntriesByHeader,
  updateBaheeEntry,
  deleteBaheeEntry
} from '../controllers/bahee.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Bahee Details routes
router.post('/bahee-details', authMiddleware, createBaheeDetails);
router.get('/bahee-details', authMiddleware, getAllBaheeDetails);
router.get('/bahee-details/:baheeType', getBaheeDetailsByType);
router.put('/bahee-details/:id', updateBaheeDetails);
router.delete('/bahee-details/:id', deleteBaheeDetails);

// Bahee Entries routes
router.post('/bahee-entries', createBaheeEntry);
router.get('/bahee-entries', getAllBaheeEntries);
router.get('/bahee-entries/:baheeType/:headerName', getBaheeEntriesByHeader);
router.put('/bahee-entries/:id', updateBaheeEntry);

router.delete('/bahee-entries/:id', deleteBaheeEntry);

export default router;