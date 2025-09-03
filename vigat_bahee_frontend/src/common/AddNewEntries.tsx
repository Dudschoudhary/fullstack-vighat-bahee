// components/AddNewEntries.tsx
import React, { useState, useEffect, useCallback, useMemo, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomVigatBaheeLogo from './CustomVigatBaheeLogo';
import { IoMdArrowRoundBack } from "react-icons/io";
import { ReactTransliterate } from 'react-transliterate';
import 'react-transliterate/dist/index.css';

// Import services and utilities
import baheeApiService from '../services/baheeApiService';
import { debounce, getHinduTithi } from '../utils/debounce';
import Loader from '../common/Loader';
import EntryForm from '../components/EntryForm'; // Import our new form component
import type {
  BaheeDetails,
  BaheeDetailsCreateRequest,
  BaheeEntryCreateRequest,
  LocationState
} from '../types/bahee.types';

const AddNewEntries: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const selectedBaheeType = state?.baheeType || '';
  const selectedBaheeTypeName = state?.baheeTypeName || '';
  const passedExisting = state?.existingBaheeData;

  // State management
  const [allSavedBaheeDetails, setAllSavedBaheeDetails] = useState<BaheeDetails[]>([]);
  const [thisTypeBaheeDetails, setThisTypeBaheeDetails] = useState<BaheeDetails | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [entryLoading, setEntryLoading] = useState<boolean>(false);

  // Local state for immediate UI feedback (prevents excessive API calls)
  const [localDetailsForm, setLocalDetailsForm] = useState({ name: '', date: '', tithi: '' });
  const [detailsForm, setDetailsForm] = useState({ name: '', date: '', tithi: '' });
  const [detailsError, setDetailsError] = useState<string>('');

  const [isAmountDisabled, setIsAmountDisabled] = useState<boolean>(false);

  // Debounced handlers to reduce API calls (300ms delay)
  const debouncedUpdateDetailsForm = useMemo(
    () => debounce((field: string, value: string) => {
      console.log(`🔄 Debounced Details Update - ${field}:`, value);
      setDetailsForm(prev => ({ ...prev, [field]: value }));
      if (field === 'date') {
        const calculatedTithi = getHinduTithi(value);
        setDetailsForm(prev => ({ ...prev, tithi: calculatedTithi }));
      }
    }, 300),
    []
  );

  // Load data on component mount
  useEffect(() => {
    const loadBaheeDetails = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading Bahee Details...');
        const response = await baheeApiService.getAllBaheeDetails();
        
        if (response.success && response.data) {
          setAllSavedBaheeDetails(response.data);
          console.log('✅ Loaded Bahee Details:', response.data);
        }
      } catch (error) {
        console.error('❌ Error loading bahee details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBaheeDetails();

    if (passedExisting) {
      setThisTypeBaheeDetails(passedExisting);
      const formData = {
        name: passedExisting.name,
        date: passedExisting.date,
        tithi: passedExisting.tithi
      };
      setDetailsForm(formData);
      setLocalDetailsForm(formData);
      console.log('📋 Using existing bahee data:', passedExisting);
    }

    const disableAmountTypes = ['odhawani', 'mahera', 'anya'];
    setIsAmountDisabled(disableAmountTypes.includes(selectedBaheeType));
  }, [selectedBaheeType, passedExisting]);

  // Handle bahee details form changes with debouncing
  const handleChangeBaheeDetails = useCallback((field: string, value: string) => {
    console.log(`⌨️ Details Input Change - ${field}:`, value);
    setLocalDetailsForm(prev => ({ ...prev, [field]: value })); // Immediate UI update
    setDetailsError('');
    
    if (field === 'date') {
      const calculatedTithi = getHinduTithi(value);
      setLocalDetailsForm(prev => ({ ...prev, tithi: calculatedTithi }));
    }
    
    debouncedUpdateDetailsForm(field, value); // Debounced actual form update
  }, [debouncedUpdateDetailsForm]);

  // Bahee details save handler
  const handleBaheeDetailsSave = async (e: FormEvent) => {
    e.preventDefault();
    const nameTrim = detailsForm.name.trim();
    
    if (!nameTrim || !detailsForm.date.trim() || !detailsForm.tithi.trim()) {
      setDetailsError('सभी विवरण अनिवार्य हैं।');
      return;
    }

    try {
      setDetailsLoading(true);
      setDetailsError('');
      console.log('💾 Saving Bahee Details...');

      const detailsData: BaheeDetailsCreateRequest = {
        baheeType: selectedBaheeType,
        baheeTypeName: selectedBaheeTypeName,
        name: nameTrim,
        date: detailsForm.date,
        tithi: detailsForm.tithi.trim()
      };

      const response = await baheeApiService.createBaheeDetails(detailsData);
      
      if (response.success && response.data) {
        setThisTypeBaheeDetails(response.data);
        console.log('✅ Bahee Details Saved:', response.data);
        
        // Refresh the list
        const updatedResponse = await baheeApiService.getAllBaheeDetails();
        if (updatedResponse.success && updatedResponse.data) {
          setAllSavedBaheeDetails(updatedResponse.data);
        }
      }
    } catch (error: any) {
      console.error('❌ Bahee Details Save Error:', error);
      if (error.message.includes('Network Error')) {
        setDetailsError('सर्वर से कनेक्शन नहीं हो पा रहा। कृपया सर्वर चालू करें।');
      } else {
        setDetailsError(error.message || 'कुछ गलत हुआ है।');
      }
    } finally {
      setDetailsLoading(false);
    }
  };

  // Handle entry submission from the EntryForm component
  const handleEntrySubmit = async (entryData: BaheeEntryCreateRequest) => {
    try {
      setEntryLoading(true);
      console.log('💾 Saving Entry...');

      const response = await baheeApiService.createBaheeEntry(entryData);
      
      if (response.success) {
        console.log('✅ Entry Saved:', response.data);
      }
    } catch (error: any) {
      console.error('❌ Entry Save Error:', error);
      alert(error.message || 'Error saving entry');
      throw error; // Re-throw to let EntryForm handle it
    } finally {
      setEntryLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleNavigateToTable = () => {
    navigate('/bahee-layout');
  };

  // Show full screen loader during initial data load
  if (loading) {
    return (
      <Loader 
        size="large" 
        text="डेटा लोड हो रहा है..." 
        fullScreen={true}
        colors={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <CustomVigatBaheeLogo />

        {/* Header form with loading state */}
        {!thisTypeBaheeDetails && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-red-600 text-3xl font-bold mr-2" role="img" aria-label="Swastik">🕉️</span>
              <h2 className="text-xl font-bold text-gray-800">
                {selectedBaheeTypeName} का विवरण जोड़ें
              </h2>
            </div>
            
            {detailsLoading && (
              <div className="mb-4">
                <Loader 
                  size="medium" 
                  text="बही विवरण सेव हो रहा है..." 
                  colors={["#32cd32", "#327fcd"]}
                />
              </div>
            )}

            <form onSubmit={handleBaheeDetailsSave} className="grid md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">नाम</label>
                <ReactTransliterate
                  value={localDetailsForm.name}
                  onChangeText={text => handleChangeBaheeDetails('name', text)}
                  lang="hi"
                  placeholder="जैसे: दुदाराम"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2"
                  disabled={detailsLoading}
                  maxOptions={3}
                  minMatchLength={2}
                  showCurrentWordAsLastOption={false}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">तारीख</label>
                <input
                  type="date"
                  value={localDetailsForm.date}
                  onChange={e => handleChangeBaheeDetails('date', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2"
                  disabled={detailsLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">तिथि</label>
                <input
                  type="text"
                  value={localDetailsForm.tithi}
                  placeholder="तिथि"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 bg-blue-50"
                  disabled={true}
                  readOnly
                />
              </div>
              <div className="col-span-3 flex gap-4 items-center mt-4">
                <button
                  type="submit"
                  disabled={detailsLoading}
                  className="px-6 py-2 rounded-lg text-white font-semibold shadow bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {detailsLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {detailsLoading ? 'Saving...' : 'Save'}
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
                disabled={entryLoading}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md group disabled:opacity-50"
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
                  <button
                    onClick={handleNavigateToTable}
                    disabled={entryLoading}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    बही विवरण
                  </button>
                </div>
              </div>
            </div>

            {/* Use the new EntryForm component */}
            <EntryForm
              thisTypeBaheeDetails={thisTypeBaheeDetails}
              isAmountDisabled={isAmountDisabled}
              entryLoading={entryLoading}
              onSubmit={handleEntrySubmit}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AddNewEntries;