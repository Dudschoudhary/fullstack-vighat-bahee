// components/EntryForm.tsx
import React, { useState, useCallback, useMemo, type ChangeEvent, type FormEvent } from 'react';
import { ReactTransliterate } from 'react-transliterate';
import 'react-transliterate/dist/index.css';
import { debounce } from '../utils/debounce';
import Loader from '../common/Loader';
import type { FormData, FormErrors, BaheeEntryCreateRequest, BaheeDetails } from '../types/bahee.types';

interface EntryFormProps {
  thisTypeBaheeDetails: BaheeDetails;
  isAmountDisabled: boolean;
  entryLoading: boolean;
  onSubmit: (entryData: BaheeEntryCreateRequest) => Promise<void>;
  onReset?: () => void;
}

const EntryForm: React.FC<EntryFormProps> = ({
  thisTypeBaheeDetails,
  isAmountDisabled,
  entryLoading,
  onSubmit,
  onReset
}) => {
  // Local state for immediate UI feedback (prevents excessive API calls)
  const [localFormData, setLocalFormData] = useState<FormData>({
    sno: '',
    caste: '',
    name: '',
    fatherName: '',
    villageName: '',
    income: '',
    amount: ''
  });

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

  // Debounced handler to reduce API calls (300ms delay)
  const debouncedUpdateFormData = useMemo(
    () => debounce((field: string, value: string) => {
      console.log(`🔄 Debounced Form Update - ${field}:`, value);
      setFormData(prev => ({ ...prev, [field]: value }));
    }, 300),
    []
  );

  // Handle form changes with debouncing
  const handleChange = useCallback((field: string, value: string) => {
    console.log(`⌨️ Entry Input Change - ${field}:`, value);
    setLocalFormData(prev => ({ ...prev, [field]: value })); // Immediate UI update
    debouncedUpdateFormData(field, value); // Debounced actual form update
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [debouncedUpdateFormData, errors]);

  const handleRegularChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange(name, value);
  }, [handleChange]);

  // Form validation
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
    const resetData = {
      sno: '',
      caste: '',
      name: '',
      fatherName: '',
      villageName: '',
      income: '',
      amount: ''
    };
    setFormData(resetData);
    setLocalFormData(resetData);
    setErrors({});
    console.log('🔄 Form Reset');
    
    if (onReset) {
      onReset();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      try {
        const entryData: BaheeEntryCreateRequest = {
          baheeType: thisTypeBaheeDetails.baheeType,
          baheeTypeName: thisTypeBaheeDetails.baheeTypeName,
          headerName: thisTypeBaheeDetails.name,
          sno: formData.sno,
          caste: formData.caste,
          name: formData.name,
          fatherName: formData.fatherName,
          villageName: formData.villageName,
          income: parseFloat(formData.income),
          amount: formData.amount ? parseFloat(formData.amount) : undefined
        };

        await onSubmit(entryData);
        handleReset(); // Reset form after successful submission
      } catch (error) {
        console.error('❌ Entry Submit Error:', error);
      }
    } else {
      setErrors(newErrors);
      console.log('❌ Form Validation Errors:', newErrors);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8">
      {entryLoading && (
        <div className="mb-6">
          <Loader 
            size="medium" 
            text="Entry सेव हो रही है..." 
            colors={["#327fcd", "#32cd32"]}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Caste Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            जाति <span className="text-red-500">*</span>
          </label>
          <ReactTransliterate
            value={localFormData.caste}
            onChangeText={(text: string) => handleChange('caste', text)}
            lang="hi"
            placeholder="जाति दर्ज करें (जैसे: brahmin)"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.caste ? 'border-red-500' : 'border-gray-300'}`}
            style={{ fontSize: '16px', fontFamily: 'inherit' }}
            disabled={entryLoading}
            maxOptions={3}
            minMatchLength={2}
          />
          {errors.caste && <p className="text-red-500 text-sm mt-1">{errors.caste}</p>}
        </div>

        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            नाम <span className="text-red-500">*</span>
          </label>
          <ReactTransliterate
            value={localFormData.name}
            onChangeText={(text: string) => handleChange('name', text)}
            lang="hi"
            placeholder="नाम दर्ज करें (जैसे: ramesh)"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            style={{ fontSize: '16px', fontFamily: 'inherit' }}
            disabled={entryLoading}
            maxOptions={3}
            minMatchLength={2}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Father Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            पिता का नाम <span className="text-red-500">*</span>
          </label>
          <ReactTransliterate
            value={localFormData.fatherName}
            onChangeText={(text: string) => handleChange('fatherName', text)}
            lang="hi"
            placeholder="पिता का नाम दर्ज करें (जैसे: suresh)"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.fatherName ? 'border-red-500' : 'border-gray-300'}`}
            style={{ fontSize: '16px', fontFamily: 'inherit' }}
            disabled={entryLoading}
            maxOptions={3}
            minMatchLength={2}
          />
          {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>}
        </div>

        {/* Village Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            गाँव का नाम <span className="text-red-500">*</span>
          </label>
          <ReactTransliterate
            value={localFormData.villageName}
            onChangeText={(text: string) => handleChange('villageName', text)}
            lang="hi"
            placeholder="गाँव का नाम दर्ज करें (जैसे: jaipur rajasthan)"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.villageName ? 'border-red-500' : 'border-gray-300'}`}
            style={{ fontSize: '16px', fontFamily: 'inherit' }}
            disabled={entryLoading}
            maxOptions={3}
            minMatchLength={2}
          />
          {errors.villageName && <p className="text-red-500 text-sm mt-1">{errors.villageName}</p>}
        </div>

        {/* Income Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            आवता <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              type="number"
              name="income"
              value={localFormData.income}
              onChange={handleRegularChange}
              className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.income ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="450"
              disabled={entryLoading}
              min="0"
              step="0.01"
            />
          </div>
          {errors.income && <p className="text-red-500 text-sm mt-1">{errors.income}</p>}
        </div>

        {/* Amount Field */}
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
              value={localFormData.amount}
              onChange={handleRegularChange}
              disabled={isAmountDisabled || entryLoading}
              className={`w-full pl-8 pr-4 py-3 border rounded-lg transition-colors ${
                isAmountDisabled
                  ? 'bg-gray-100 cursor-not-allowed text-gray-500 border-gray-200'
                  : `focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.amount ? 'border-red-500' : 'border-gray-300'}`
              }`}
              placeholder={isAmountDisabled ? "लागू नहीं" : "600"}
              min="0"
              step="0.01"
            />
          </div>
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          type="submit"
          disabled={entryLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {entryLoading && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          )}
          {entryLoading ? 'Submitting...' : 'Submit'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={entryLoading}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-lg transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
    </form>
    </>
  );
};

export default EntryForm;