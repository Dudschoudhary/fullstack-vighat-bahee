// routes/baheeRoutes.js
import express from 'express';
import {
  personalCreateBaheeEntry,
  getPersonalAllBaheeEntries,
  getPersonalBaheeEntriesByHeader,
  personalUpdateBaheeEntry,
  personalDeleteBaheeEntry
} from '../controllers/personalbahee.controller.js';

const router = express.Router();

// Bahee Entries routes
router.post('/personalbahee', personalCreateBaheeEntry);
router.get('/personalbahee', getPersonalAllBaheeEntries);
router.get('/personalbahee/:baheeType/:headerName', getPersonalBaheeEntriesByHeader);
router.put('/personalbahee/:id', personalUpdateBaheeEntry);

router.delete('/personalbahee/:id', personalDeleteBaheeEntry);

export default router;