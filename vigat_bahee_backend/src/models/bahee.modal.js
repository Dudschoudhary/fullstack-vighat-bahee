// models/BaheeDetails.js
import mongoose, { Schema } from 'mongoose';

const baheeDetailsSchema = new mongoose.Schema({
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
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  tithi: {
    type: String,
    required: true,
    trim: true
  },  
    user_id:{
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
});

// Create compound index for uniqueness
baheeDetailsSchema.index({ baheeType: 1, name: 1 }, { unique: true });

export default mongoose.model('BaheeDetails', baheeDetailsSchema);