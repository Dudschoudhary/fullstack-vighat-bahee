// controllers/baheeController.js
import BaheeDetails from '../models/bahee.modal.js';
import BaheeEntry from '../models/BaheeEntry.modal.js';
import { User } from '../models/user.model.js';

// Bahee Details Controllers
export const createBaheeDetails = async (req, res) => {
  try {
    const user_id = req.user._id
    const { baheeType, baheeTypeName, name, date, tithi } = req.body;
    
    if (!baheeType || !baheeTypeName || !name || !date || !tithi) {
      return res.status(400).json({
        success: false,
        message: 'सभी विवरण अनिवार्य हैं।'
      });
    }

    const existingDetails = await BaheeDetails.findOne({
      baheeType: baheeType.trim(),
      name: name.trim().toLowerCase(),
      user_id
    });

    if (existingDetails) {
      return res.status(400).json({
        success: false,
        message: 'इस बही प्रकार में यह नाम पहले से मौजूद है।',

      });
    }

    const baheeDetails = new BaheeDetails({
      baheeType: baheeType.trim(),
      baheeTypeName: baheeTypeName.trim(),
      name: name.trim(),
      date,
      tithi: tithi.trim(),
      user_id
    });

    const baheeData = await baheeDetails.save();

    await User.findByIdAndUpdate(user_id, {
      $push: {baheeDetails_ids : baheeData._id},
    })


    res.status(201).json({
      success: true,
      message: 'बही विवरण सफलतापूर्वक सेव हो गया।',
      data: baheeDetails
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getAllBaheeDetails = async (req, res) => {
  try {
    const user_id = req.user._id
    const baheeDetails = await User.findById(user_id).populate("baheeDetails_ids")
    
    res.status(200).json({
      success: true,
      data: baheeDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getBaheeDetailsByType = async (req, res) => {
  try {
    const { baheeType } = req.params;
    const baheeDetails = await BaheeDetails.find({ baheeType }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: baheeDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const updateBaheeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedDetails = await BaheeDetails.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedDetails) {
      return res.status(404).json({
        success: false,
        message: 'Bahee details not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'बही विवरण अपडेट हो गया।',
      data: updatedDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const deleteBaheeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedDetails = await BaheeDetails.findByIdAndDelete(id);
    
    if (!deletedDetails) {
      return res.status(404).json({
        success: false,
        message: 'Bahee details not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'बही विवरण डिलीट हो गया।'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Bahee Entries Controllers
export const createBaheeEntry = async (req, res) => {
  try {
    const { 
      baheeType, 
      baheeTypeName, 
      headerName, 
      caste, 
      name, 
      fatherName, 
      villageName, 
      income, 
      amount 
    } = req.body;

    if (!baheeType || !baheeTypeName || !headerName || !caste || !name || !fatherName || !villageName || !income) {
      return res.status(400).json({
        success: false,
        message: 'सभी आवश्यक फील्ड भरें।'
      });
    }

    const disableAmountTypes = ['odhawani', 'mahera', 'anya'];
    const isAmountRequired = !disableAmountTypes.includes(baheeType);
    
    if (isAmountRequired && !amount) {
      return res.status(400).json({
        success: false,
        message: 'ऊपर नेत दर्ज करें।'
      });
    }

    const baheeDetailsExist = await BaheeDetails.findOne({
      baheeType,
      name: headerName
    });

    if (!baheeDetailsExist) {
      return res.status(400).json({
        success: false,
        message: 'बही विवरण नहीं मिला। कृपया पहले बही विवरण सेव करें।'
      });
    }

    const baheeEntry = new BaheeEntry({
      baheeType: baheeType.trim(),
      baheeTypeName: baheeTypeName.trim(),
      headerName: headerName.trim(),
      caste: caste.trim(),
      name: name.trim(),
      fatherName: fatherName.trim(),
      villageName: villageName.trim(),
      income: parseFloat(income),
      amount: isAmountRequired ? parseFloat(amount) : null,
      // user_id
    });

    await baheeEntry.save();

    res.status(201).json({
      success: true,
      message: 'Entry successfully added!',
      data: baheeEntry
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getAllBaheeEntries = async (req, res) => {
  try {
    const entries = await BaheeEntry.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: entries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getBaheeEntriesByHeader = async (req, res) => {
  try {
    const { baheeType, headerName } = req.params;
    const entries = await BaheeEntry.find({ 
      baheeType, 
      headerName 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: entries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const updateBaheeEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedEntry = await BaheeEntry.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedEntry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Entry अपडेट हो गई।',
      data: updatedEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const deleteBaheeEntry = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedEntry = await BaheeEntry.findByIdAndDelete(id);
    
    if (!deletedEntry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Entry डिलीट हो गई।'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};