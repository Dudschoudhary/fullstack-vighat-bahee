import React, { useState, useCallback, useMemo, useRef, type ChangeEvent, type FormEvent } from 'react';
import { ReactTransliterate } from 'react-transliterate';
import Tesseract from 'tesseract.js';
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
  isAnyaBahee?: boolean;
  uparnetToggle?: boolean;
  onToggleChange?: (enabled: boolean) => void;
}

const EntryForm: React.FC<EntryFormProps> = ({
  thisTypeBaheeDetails,
  isAmountDisabled,
  entryLoading,
  onSubmit,
  onReset,
  isAnyaBahee = false,
  uparnetToggle = false,
}) => {
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
  
  // OCR related states
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [extractedText, setExtractedText] = useState<string>('');
  const [showOcrModal, setShowOcrModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const debouncedUpdateFormData = useMemo(
    () => debounce((field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    }, 300),
    []
  );

  const handleChange = useCallback((field: string, value: string) => {
    setLocalFormData(prev => ({ ...prev, [field]: value }));
    debouncedUpdateFormData(field, value);
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [debouncedUpdateFormData, errors]);

  const handleRegularChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange(name, value);
  }, [handleChange]);

  // ✅ OCR Image Upload Handler
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setShowOcrModal(true);
    }
  };

  // ✅ OCR Text Extraction using Tesseract.js
  const handleOCRProcessing = async () => {
    if (!selectedImage) return;

    setOcrLoading(true);
    setOcrProgress(0);
    setExtractedText('');

    try {
      const { data: { text } } = await Tesseract.recognize(
        selectedImage,
        'hin+eng', // Hindi + English support
        {
          logger: (progress) => {
            console.log(progress);
            if (progress.status === 'recognizing text') {
              setOcrProgress(Math.round(progress.progress * 100));
            }
          }
        }
      );

      setExtractedText(text);
      
      // ✅ Auto-populate form fields from extracted text
      populateFormFromText(text);
      
    } catch (error) {
      console.error('❌ OCR Error:', error);
      alert('OCR processing में error आया है। कृपया दोबारा try करें।');
    } finally {
      setOcrLoading(false);
      setOcrProgress(0);
    }
  };

  // ✅ Smart text parsing to populate form fields
  const populateFormFromText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    // Basic patterns for different fields (you can customize these)
    const patterns = {
      // Look for numeric values for income/amount
      income: /₹?\s*(\d+(?:\.\d{2})?)/g,
      amount: /amount|राशि|ऊपर\s*नेत.*?₹?\s*(\d+(?:\.\d{2})?)/gi,
      
      // Look for names (usually longer text without numbers)
      name: /नाम|name.*?[:\-]?\s*([a-zA-Z\u0900-\u097F\s]{3,})/gi,
      fatherName: /पिता|father.*?[:\-]?\s*([a-zA-Z\u0900-\u097F\s]{3,})/gi,
      
      // Look for village/location
      village: /गाँव|village|ग्राम.*?[:\-]?\s*([a-zA-Z\u0900-\u097F\s]{2,})/gi,
      
      // Look for caste
      caste: /जाति|caste.*?[:\-]?\s*([a-zA-Z\u0900-\u097F\s]{2,})/gi
    };

    const extractedData: Partial<FormData> = {};

    // Extract income/amount (look for numbers)
    const numbers = text.match(/\d+(?:\.\d{2})?/g);
    if (numbers && numbers.length > 0) {
      // First number could be income, second could be amount
      extractedData.income = numbers[0];
      if (numbers.length > 1) {
        extractedData.amount = numbers[1];
      }
    }

    // Try to extract other fields using patterns
    Object.entries(patterns).forEach(([field, pattern]) => {
      const match = pattern.exec(text);
      if (match && match[1]) {
        const value = match[1].trim();
        if (field === 'income' || field === 'amount') {
          extractedData[field as keyof FormData] = value;
        } else if (value.length > 1 && !/^\d+$/.test(value)) {
          extractedData[field as keyof FormData] = value;
        }
      }
    });

    // Update form data with extracted values
    const newFormData = { ...formData };
    const newLocalFormData = { ...localFormData };

    Object.entries(extractedData).forEach(([key, value]) => {
      if (value && value.toString().trim()) {
        newFormData[key as keyof FormData] = value.toString();
        newLocalFormData[key as keyof FormData] = value.toString();
      }
    });

    setFormData(newFormData);
    setLocalFormData(newLocalFormData);
    
    // Close OCR modal after processing
    setShowOcrModal(false);
    
    alert(`✅ OCR से ${Object.keys(extractedData).length} fields auto-fill हो गए हैं। कृपया verify करें।`);
  };

  // ✅ Form validation with toggle logic
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.caste) newErrors.caste = 'जाति दर्ज करें';
    if (!formData.name) newErrors.name = 'नाम दर्ज करें';
    if (!formData.fatherName) newErrors.fatherName = 'पिता का नाम दर्ज करें';
    if (!formData.villageName) newErrors.villageName = 'गाँव का नाम दर्ज करें';
    if (!formData.income) newErrors.income = 'आवता दर्ज करें';
    
    const shouldValidateAmount = isAnyaBahee ? uparnetToggle : !isAmountDisabled;
    if (shouldValidateAmount && !formData.amount) {
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
    setSelectedImage('');
    setExtractedText('');
    
    if (onReset) {
      onReset();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      try {
        const finalAmount = (isAnyaBahee && !uparnetToggle) ? 0 : 
                            formData.amount ? parseFloat(formData.amount) : 0;
                            
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
          amount: finalAmount
        };

        await onSubmit(entryData);
        handleReset();
      } catch (error) {
        console.error('❌ Entry Submit Error:', error);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const isAmountFieldDisabled = isAnyaBahee ? !uparnetToggle : isAmountDisabled;

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

        {/* ✅ OCR Page Read Button */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">नई Entries जोड़ें</h2>
          
          <div className="flex gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Existing form fields remain the same */}
          
          {/* Caste Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              जाति <span className="text-red-500">*</span>
            </label>
            <ReactTransliterate
              value={localFormData.caste}
              onChangeText={(text: string) => handleChange('caste', text)}
              lang="hi"
              placeholder="जाति"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.caste ? 'border-red-500' : 'border-gray-300'}`}
              style={{ fontSize: '16px', fontFamily: 'inherit' }}
              disabled={entryLoading}
              maxOptions={3}
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
              placeholder="नाम"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              style={{ fontSize: '16px', fontFamily: 'inherit' }}
              disabled={entryLoading}
              maxOptions={3}
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
              placeholder="पिता का नाम"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.fatherName ? 'border-red-500' : 'border-gray-300'}`}
              style={{ fontSize: '16px', fontFamily: 'inherit' }}
              disabled={entryLoading}
              maxOptions={3}
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
              placeholder="गाँव का नाम"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.villageName ? 'border-red-500' : 'border-gray-300'}`}
              style={{ fontSize: '16px', fontFamily: 'inherit' }}
              disabled={entryLoading}
              maxOptions={3}
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
                placeholder="100"
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
              ऊपर नेत 
              {(isAnyaBahee ? uparnetToggle : !isAmountDisabled) && (
                <span className="text-red-500">*</span>
              )}
              
              {isAnyaBahee && !uparnetToggle && (
                <span className="text-orange-600 text-xs ml-2">(इस बही के लिए लागू नहीं है।)</span>
              )}
              {!isAnyaBahee && isAmountDisabled && (
                <span className="text-orange-600 text-xs ml-2">(इस बही प्रकार के लिए लागू नहीं)</span>
              )}
            </label>
            <div className="relative">
              <span className={`absolute left-3 top-3 ${isAmountFieldDisabled ? 'text-gray-400' : 'text-gray-500'}`}>₹</span>
              <input
                type="number"
                name="amount"
                value={localFormData.amount}
                onChange={handleRegularChange}
                disabled={isAmountFieldDisabled || entryLoading}
                className={`w-full pl-8 pr-4 py-3 border rounded-lg transition-colors ${
                  isAmountFieldDisabled
                    ? 'bg-gray-100 cursor-not-allowed text-gray-500 border-gray-200'
                    : `focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.amount ? 'border-red-500' : 'border-gray-300'}`
                }`}
                placeholder={isAmountFieldDisabled ? "लागू नहीं" : "100"}
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

      {/* ✅ OCR Modal */}
      {showOcrModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Page OCR Processing</h3>
                <button
                  onClick={() => setShowOcrModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Image Preview */}
              <div className="mb-4">
                <img
                  src={selectedImage}
                  alt="Selected document"
                  className="max-w-full h-auto max-h-96 mx-auto border rounded-lg"
                />
              </div>

              {/* OCR Controls */}
              <div className="flex gap-4 mb-4">
                <button
                  onClick={handleOCRProcessing}
                  disabled={ocrLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  {ocrLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    '🔍 Extract Text'
                  )}
                </button>
              </div>

              {/* OCR Progress */}
              {ocrLoading && (
                <div className="mb-4">
                  <div className="bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${ocrProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">{ocrProgress}% Complete</p>
                </div>
              )}

              {/* Extracted Text */}
              {extractedText && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Extracted Text:</h4>
                  <div className="bg-gray-100 p-4 rounded-lg max-h-40 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm">{extractedText}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EntryForm;