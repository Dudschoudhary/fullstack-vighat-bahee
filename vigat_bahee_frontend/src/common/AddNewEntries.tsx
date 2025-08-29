import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomVigatBaheeLogo from './CustomVigatBaheeLogo';
import { IoMdArrowRoundBack } from "react-icons/io";
import { ReactTransliterate } from 'react-transliterate';
import 'react-transliterate/dist/index.css';

interface BaheeDetails {
  id: string; // `${baheeType}::${name}`
  baheeType: string;
  baheeTypeName: string;
  name: string;
  date: string;
  tithi: string;
  createdAt: string;
}

interface FormData {
  sno: string;
  caste: string;
  name: string;
  fatherName: string;
  villageName: string;
  income: string;
  amount: string;
}

interface FormErrors {
  [key: string]: string;
}

interface LocationState {
  baheeType?: string;
  baheeTypeName?: string;
  existingBaheeData?: BaheeDetails; // when navigating from existing dropdown
}

const BAHEE_DETAIL_KEY = 'baheeDetailsSavedArr';

const normalizedId = (baheeType: string, name: string) =>
  `${(baheeType || '').trim()}::${(name || '').trim().toLowerCase()}`;

const getHinduTithi = (date: string): string => {
  if (!date) return '';
  const selectedDate = new Date(date);
  const day = selectedDate.getDate();
  const tithiNames = [
    'प्रतिपदा','द्वितीया','तृतीया','चतुर्थी','पंचमी','षष्ठी','सप्तमी','अष्टमी',
    'नवमी','दशमी','एकादशी','द्वादशी','त्रयोदशी','चतुर्दशी','पूर्णिमा'
  ];
  const paksha = day <= 15 ? 'शुक्ल' : 'कृष्ण';
  const tithiIndex = day <= 15 ? day - 1 : day - 16;
  const tithiName = tithiNames[tithiIndex] || tithiNames[0];
  return `${paksha} ${tithiName}`;
};

const AddNewEntries: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const selectedBaheeType = state?.baheeType || '';
  const selectedBaheeTypeName = state?.baheeTypeName || '';
  const passedExisting = state?.existingBaheeData;

  const [allSavedBaheeDetails, setAllSavedBaheeDetails] = useState<BaheeDetails[]>([]);
  const [thisTypeBaheeDetails, setThisTypeBaheeDetails] = useState<BaheeDetails | undefined>(undefined);

  const [formData, setFormData] = useState<FormData>({
    sno: '',
    caste: '',
    name: '',
    fatherName: '',
    villageName: '',
    income: '',
    amount: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isAmountDisabled, setIsAmountDisabled] = useState<boolean>(false);

  const [detailsForm, setDetailsForm] = useState({ name: '', date: '', tithi: '' });
  const [detailsError, setDetailsError] = useState<string>('');

  useEffect(() => {
    const arr: BaheeDetails[] = JSON.parse(localStorage.getItem(BAHEE_DETAIL_KEY) || '[]');
    setAllSavedBaheeDetails(arr);

    // If coming with an existing selected header, use it
    if (passedExisting) {
      setThisTypeBaheeDetails(passedExisting);
      setDetailsForm({
        name: passedExisting.name,
        date: passedExisting.date,
        tithi: passedExisting.tithi
      });
    } else if (selectedBaheeType) {
      // Try to find a header already saved for this type+name if any
      // In "Add New" flow there is no name yet; we only show the header form
      setThisTypeBaheeDetails(undefined);
    }

    const disableAmountTypes = ['odhawani', 'mahera', 'anya'];
    setIsAmountDisabled(disableAmountTypes.includes(selectedBaheeType));
  }, [selectedBaheeType, passedExisting]);

  const handleChangeBaheeDetails = (field: string, value: string) => {
    setDetailsForm(prev => ({ ...prev, [field]: value }));
    setDetailsError('');
    if (field === 'date') {
      const calculatedTithi = getHinduTithi(value);
      setDetailsForm(prev => ({ ...prev, tithi: calculatedTithi }));
    }
  };

  const handleBaheeDetailsSave = (e: React.FormEvent) => {
    e.preventDefault();
    const nameTrim = detailsForm.name.trim();
    if (!nameTrim || !detailsForm.date.trim() || !detailsForm.tithi.trim()) {
      setDetailsError('सभी विवरण अनिवार्य हैं।');
      return;
    }

    // Duplicate rule: same name cannot exist within the same baheeType (case-insensitive)
    const id = normalizedId(selectedBaheeType, nameTrim);
    const existsSameTypeSameName = allSavedBaheeDetails.some(
      d => d.id === id
    );
    if (existsSameTypeSameName) {
      setDetailsError('इस बही प्रकार में यह नाम पहले से मौजूद है।');
      return;
    }

    // Allow same name in other types; no block needed.

    const newDetails: BaheeDetails = {
      id,
      baheeType: selectedBaheeType,
      baheeTypeName: selectedBaheeTypeName,
      name: nameTrim,
      date: detailsForm.date,
      tithi: detailsForm.tithi.trim(),
      createdAt: new Date().toISOString(),
    };

    // Keep others intact; add this header
    const updated = [...allSavedBaheeDetails, newDetails];
    setAllSavedBaheeDetails(updated);
    setThisTypeBaheeDetails(newDetails);
    localStorage.setItem(BAHEE_DETAIL_KEY, JSON.stringify(updated));

    // Optional UX: lock the header form after successful save
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRegularChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.caste) newErrors.caste = 'जाति दर्ज करें';
    if (!formData.name) newErrors.name = 'नाम दर्ज करें';
    if (!formData.fatherName) newErrors.fatherName = 'पिता का नाम दर्ज करें';
    if (!formData.villageName) newErrors.villageName = 'गाँव का नाम दर्ज करें';
    if (!formData.income) newErrors.income = 'आवता दर्ज करें';
    if (!isAmountDisabled && !formData.amount) {
      newErrors.amount = 'ऊपर नेत दर्ज करें';
    }
    return newErrors;
  };

  const handleReset = () => {
    setFormData({
      sno: '',
      caste: '',
      name: '',
      fatherName: '',
      villageName: '',
      income: '',
      amount: ''
    });
    setErrors({});
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      if (!thisTypeBaheeDetails) {
        alert('कृपया पहले बही विवरण सेव करें (ऊपर हेडर भाग) ।');
        return;
      }

      const submissionData = {
        ...formData,
        baheeType: thisTypeBaheeDetails.baheeType,
        baheeTypeName: thisTypeBaheeDetails.baheeTypeName,
        headerName: thisTypeBaheeDetails.name,
        submittedAt: new Date().toISOString()
      };

      const existingEntries = JSON.parse(localStorage.getItem('baheeEntries') || '[]');
      existingEntries.push(submissionData);
      localStorage.setItem('baheeEntries', JSON.stringify(existingEntries));

      handleReset();
      alert('Entry successfully added!');
    } else {
      setErrors(newErrors);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // New function to navigate to table layout
  const handleNavigateToTable = () => {
    navigate('/bahee-layout'); // Adjust this path according to your route
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <CustomVigatBaheeLogo />

        {/* Header form only if header not yet selected/created */}
        {!thisTypeBaheeDetails && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-red-600 text-3xl font-bold mr-2" role="img" aria-label="Swastik">🕉️</span>
              <h2 className="text-xl font-bold text-gray-800">
                {selectedBaheeTypeName} का विवरण जोड़ें
              </h2>
            </div>
            <form onSubmit={handleBaheeDetailsSave} className="grid md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">नाम</label>
                <ReactTransliterate
                  value={detailsForm.name}
                  onChangeText={text => handleChangeBaheeDetails('name', text)}
                  lang="hi"
                  placeholder="जैसे: दुदाराम"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">तारीख</label>
                <input
                  type="date"
                  value={detailsForm.date}
                  onChange={e => handleChangeBaheeDetails('date', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">तिथि</label>
                <ReactTransliterate
                  value={detailsForm.tithi}
                  onChangeText={text => handleChangeBaheeDetails('tithi', text)}
                  lang="hi"
                  placeholder="तिथि"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 bg-blue-50"
                  disabled
                />
              </div>
              <div className="col-span-3 flex gap-4 items-center mt-4">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg text-white font-semibold shadow bg-blue-600 hover:bg-blue-700"
                >
                  Save
                </button>
                {detailsError && <span className="text-red-500">{detailsError}</span>}
              </div>
            </form>
          </div>
        )}

        {thisTypeBaheeDetails && (
          <>
            <div className="flex justify-end mb-6 md:mt-10">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md group"
              >
                <span className="font-medium flex justify-center items-center gap-2">
                  <IoMdArrowRoundBack /> Back
                </span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center sm:text-left">
                  नई Entries जोड़ें
                </h1>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                    <h2 className="text-lg font-semibold text-blue-800">
                      {thisTypeBaheeDetails.baheeTypeName} — {thisTypeBaheeDetails.name}
                    </h2>
                    <p className="text-sm text-blue-600">Selected Bahee Header</p>
                  </div>
                  {/* New Bahee Vivran Button */}
                  <button
                    onClick={handleNavigateToTable}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    बही विवरण
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    जाति <span className="text-red-500">*</span>
                  </label>
                  <ReactTransliterate
                    value={formData.caste}
                    onChangeText={(text: string) => handleChange('caste', text)}
                    lang="hi"
                    placeholder="जाति दर्ज करें (जैसे: brahmin)"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.caste ? 'border-red-500' : 'border-gray-300'}`}
                    style={{ fontSize: '16px', fontFamily: 'inherit' }}
                  />
                  {errors.caste && <p className="text-red-500 text-sm mt-1">{errors.caste}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    नाम <span className="text-red-500">*</span>
                  </label>
                  <ReactTransliterate
                    value={formData.name}
                    onChangeText={(text: string) => handleChange('name', text)}
                    lang="hi"
                    placeholder="नाम दर्ज करें (जैसे: ramesh)"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    style={{ fontSize: '16px', fontFamily: 'inherit' }}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    पिता का नाम <span className="text-red-500">*</span>
                  </label>
                  <ReactTransliterate
                    value={formData.fatherName}
                    onChangeText={(text: string) => handleChange('fatherName', text)}
                    lang="hi"
                    placeholder="पिता का नाम दर्ज करें (जैसे: suresh)"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.fatherName ? 'border-red-500' : 'border-gray-300'}`}
                    style={{ fontSize: '16px', fontFamily: 'inherit' }}
                  />
                  {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    गाँव का नाम <span className="text-red-500">*</span>
                  </label>
                  <ReactTransliterate
                    value={formData.villageName}
                    onChangeText={(text: string) => handleChange('villageName', text)}
                    lang="hi"
                    placeholder="गाँव का नाम दर्ज करें (जैसे: jaipur rajasthan)"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.villageName ? 'border-red-500' : 'border-gray-300'}`}
                    style={{ fontSize: '16px', fontFamily: 'inherit' }}
                  />
                  {errors.villageName && <p className="text-red-500 text-sm mt-1">{errors.villageName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    आवता <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">₹</span>
                    <input
                      type="number"
                      name="income"
                      value={formData.income}
                      onChange={handleRegularChange}
                      className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.income ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="450"
                    />
                  </div>
                  {errors.income && <p className="text-red-500 text-sm mt-1">{errors.income}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ऊपर नेत {!isAmountDisabled && <span className="text-red-500">*</span>}
                    {isAmountDisabled && <span className="text-orange-600 text-xs ml-2">(इस बही प्रकार के लिए लागू नहीं)</span>}
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3 top-3 ${isAmountDisabled ? 'text-gray-400' : 'text-gray-500'}`}>₹</span>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleRegularChange}
                      disabled={isAmountDisabled}
                      className={`w-full pl-8 pr-4 py-3 border rounded-lg transition-colors ${
                        isAmountDisabled
                          ? 'bg-gray-100 cursor-not-allowed text-gray-500 border-gray-200'
                          : `focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.amount ? 'border-red-500' : 'border-gray-300'}`
                      }`}
                      placeholder={isAmountDisabled ? "लागू नहीं" : "600"}
                    />
                  </div>
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-lg transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Reset
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AddNewEntries;