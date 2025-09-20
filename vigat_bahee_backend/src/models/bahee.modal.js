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

export default mongoose.model('BaheeDetails', baheeDetailsSchema);