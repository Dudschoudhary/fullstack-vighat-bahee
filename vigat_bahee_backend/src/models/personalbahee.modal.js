// models/personalbahee.modal.js
import mongoose, { Schema } from 'mongoose';

const personalBaheeEntrySchema = new mongoose.Schema(
  {
    baheeType: {
      type: String,
      required: true,
      trim: true,
    },
    baheeTypeName: {
      type: String,
      required: true,
      trim: true,
    },
    headerName: {
      type: String,
      required: true,
      trim: true,
    },
    sno: {
      type: String,
      default: '',
    },
    caste: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fatherName: {
      type: String,
      required: true,
      trim: true,
    },
    villageName: {
      type: String,
      required: true,
      trim: true,
    },
    income: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      default: null,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true, // ✅ हर entry किसी user की होनी चाहिए
    },
  },
  {
    timestamps: true,
  }
);

// Optional: per-user uniqueness (chahe to use kare)
personalBaheeEntrySchema.index(
  { user_id: 1, baheeType: 1, headerName: 1, name: 1 },
  { unique: false } // true kare to duplicate रोक जाएगा
);

export default mongoose.model('PersonalbaheeModal', personalBaheeEntrySchema);