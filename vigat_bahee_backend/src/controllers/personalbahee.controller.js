import PersonalbaheeModal from "../models/personalbahee.modal.js";
import { User } from "../models/user.model.js";

export const personalCreateBaheeEntry = async (req, res) => {
  console.log("dudaram Received Data:", req.body);  

  const user_id = req.body.user_id;

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
      amount,
      user_id
    } = req.body;

    // console.log("dudaram Received Data:", req.body);  

    const missing = [];
    if (!baheeType) missing.push('baheeType');
    if (!baheeTypeName) missing.push('baheeTypeName');
    if (!headerName) missing.push('headerName');
    if (!caste) missing.push('caste');
    if (!name) missing.push('name');
    if (!fatherName) missing.push('fatherName');
    if (!villageName) missing.push('villageName');
    if (!income && income !== 0) missing.push('income');

    if (missing.length > 0) {
      console.error('❌ Missing fields:', missing);
      return res.status(400).json({
        success: false,
        message: 'सभी आवश्यक फील्ड भरें।',
        missingFields: missing
      });
    }
    
    const disableAmountTypes = ['odhawani', 'mahera'];
    const isAmountRequired = !disableAmountTypes.includes(baheeType);

    // const user_id = req.body.user_id;

    console.log("dudaram user_id:", user_id);

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
      // user_id: user_id
    });


    console.log("dudaram Saving Entry:", baheeEntry);
    await baheeEntry.save();

    res.status(201).json({
      success: true,
      message: 'Entry successfully added!',
      data: baheeEntry
    });

  } catch (error) {
    console.error('❌ Backend Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
export const getPersonalAllBaheeEntries = async (req, res) => {

  console.log("dudaram req.body:", req.body);
  // const user_id = req.user._id


  try {
    const entries = await PersonalbaheeModal.find().sort({ createdAt: -1 });
    console.log("dudaram  Entries:", JSON.stringify(entries, null, 2));
    
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