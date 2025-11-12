import PersonalbaheeModal from "../models/personalbahee.modal.js";
import BaheeDetails from '../models/bahee.modal.js';


export const personalCreateBaheeEntry = async (req, res) => {
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

    const disableAmountTypes = ['odhawani', 'mahera'];
    const isAmountRequired = !disableAmountTypes.includes(baheeType);
    
    // if (isAmountRequired && !amount) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'ऊपर नेत दर्ज करें।'
    //   });
    // }

    const baheeEntry = new PersonalbaheeModal({
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

export const getPersonalAllBaheeEntries = async (req, res) => {
  try {
    const entries = await PersonalbaheeModal.find().sort({ createdAt: -1 });
    
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

export const getPersonalBaheeEntriesByHeader = async (req, res) => {
  try {
    const { baheeType, headerName } = req.params;
    const entries = await PersonalbaheeModal.find({ 
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

export const personalUpdateBaheeEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedEntry = await PersonalbaheeModal.findByIdAndUpdate(
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

export const personalDeleteBaheeEntry = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedEntry = await PersonalbaheeModal.findByIdAndDelete(id);
    
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