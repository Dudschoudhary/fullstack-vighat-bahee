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
// Allow public create/read so entries can be added/checked without login
router.post('/bahee-details', createBaheeDetails);
router.get('/bahee-details', getAllBaheeDetails);
router.get('/bahee-details/:baheeType', getBaheeDetailsByType);
router.put('/bahee-details/:id', updateBaheeDetails);
router.delete('/bahee-details/:id', deleteBaheeDetails);

// Bahee Entries routes
// Allow public create/read of entries for easy testing/checking
router.post('/bahee-entries', createBaheeEntry);
router.get('/bahee-entries', getAllBaheeEntries);
router.get('/bahee-entries/:baheeType/:headerName', getBaheeEntriesByHeader);
// Keep update/delete protected
router.put('/bahee-entries/:id', authMiddleware, updateBaheeEntry);
router.delete('/bahee-entries/:id', authMiddleware, deleteBaheeEntry);

export default router;