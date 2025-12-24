import PersonalbaheeModal from '../models/personalbahee.modal.js';

// CREATE
export const personalCreateBaheeEntry = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: req.user missing'
      });
    }

    const user_id = req.user._id; // ✅ अब safe है

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

    // ... (same validation)

    const disableAmountTypes = ['odhawani', 'mahera'];
    const isAmountRequired = !disableAmountTypes.includes(baheeType);

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
      user_id
    });

    await baheeEntry.save();

    res.status(201).json({
      success: true,
      message: 'Entry successfully added!',
      data: baheeEntry
    });
  } catch (error) {
    console.error('personalCreateBaheeEntry Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getPersonalAllBaheeEntries = async (req, res) => {
  try {
    const user_id = req.user._id;

    const entries = await PersonalbaheeModal.find({ user_id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error('getPersonalAllBaheeEntries Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getPersonalBaheeEntriesByHeader = async (req, res) => {
  try {
    const { baheeType, headerName } = req.params;
    const user_id = req.user._id;

    const entries = await PersonalbaheeModal.find({
      user_id,
      baheeType,
      headerName,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error('getPersonalBaheeEntriesByHeader Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const personalUpdateBaheeEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user._id;

    const existing = await PersonalbaheeModal.findOne({ _id: id, user_id });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found या access denied',
      });
    }

    const updatedEntry = await PersonalbaheeModal.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Entry अपडेट हो गई।',
      data: updatedEntry,
    });
  } catch (error) {
    console.error('personalUpdateBaheeEntry Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const personalDeleteBaheeEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user._id;

    const deletedEntry = await PersonalbaheeModal.findOneAndDelete({
      _id: id,
      user_id,
    });

    if (!deletedEntry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found या access denied',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Entry डिलीट हो गई।',
    });
  } catch (error) {
    console.error('personalDeleteBaheeEntry Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};