// models/BaheeEntry.js
import mongoose from 'mongoose';

const baheeEntrySchema = new mongoose.Schema({
  baheeType: {
    type: String,
    required: true,
    trim: true
  },
  baheeTypeName: {
    type: String,
    required: true,
    trim: true
  },
  headerName: {
    type: String,
    required: true,
    trim: true
  },
  sno: {
    type: String,
    default: ''
  },
  caste: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  fatherName: {
    type: String,
    required: true,
    trim: true
  },
  villageName: {
    type: String,
    required: true,
    trim: true
  },
  income: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    default: null
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  lockDate: {
    type: Date,
    default: null
  },
  lockDescription: {
    type: String,
    default: ""
  },
}, {
  timestamps: true
});

export default mongoose.model('BaheeEntry', baheeEntrySchema);