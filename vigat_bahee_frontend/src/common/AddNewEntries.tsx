import React, { useState, useEffect, useCallback, useMemo, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomVigatBaheeLogo from './CustomVigatBaheeLogo';
import { IoMdArrowRoundBack } from "react-icons/io";
import { ReactTransliterate } from 'react-transliterate';
import 'react-transliterate/dist/index.css';

// Import services and utilities
import baheeApiService from '../services/baheeApiService';
import { debounce } from '../utils/debounce';
import { getAccurateHinduTithi, getTodayDate, isValidDate } from '../utils/hinduCalendar';
import Loader from '../common/Loader';
import EntryForm from '../components/EntryForm';
import type {
  BaheeDetails,
  BaheeDetailsCreateRequest,
  BaheeEntryCreateRequest,
  LocationState
} from '../types/bahee.types';
import Footer from '../google adsense/Footer';

const AddNewEntries: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const selectedBaheeType = state?.baheeType || '';
  const selectedBaheeTypeName = state?.baheeTypeName || '';
  const passedExisting = state?.existingBaheeData;

  const initialToggleFromVigatBahee = state?.initialUparnetToggle || false;

  const [allSavedBaheeDetails, setAllSavedBaheeDetails] = useState<BaheeDetails[]>([]);
  const [thisTypeBaheeDetails, setThisTypeBaheeDetails] = useState<BaheeDetails | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [entryLoading, setEntryLoading] = useState<boolean>(false);

  const [uparnetToggle, setUparnetToggle] = useState<boolean>(initialToggleFromVigatBahee);

  const [localDetailsForm, setLocalDetailsForm] = useState({ 
    name: '', 
    date: getTodayDate(), 
    tithi: '' 
  });
  const [detailsForm, setDetailsForm] = useState({ 
    name: '', 
    date: getTodayDate(), 
    tithi: '' 
  });
  const [detailsError, setDetailsError] = useState<string>('');
  const [dateError, setDateError] = useState<string>('');

  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isAmountDisabled, setIsAmountDisabled] = useState<boolean>(false);

  // ✅ Get max date (today) for date input
  const maxDate = getTodayDate();

  // ✅ Check if current bahee is "anya" type
  const isAnyaBahee = selectedBaheeType === 'anya';

  // Debounced handlers
  const debouncedUpdateDetailsForm = useMemo(
    () => debounce((field: string, value: string) => {
      setDetailsForm(prev => ({ ...prev, [field]: value }));
      if (field === 'date') {
        if (isValidDate(value)) {
          const calculatedTithi = getAccurateHinduTithi(value);
          setDetailsForm(prev => ({ ...prev, tithi: calculatedTithi }));
          setDateError('');
        } else {
          setDateError('भविष्य की तारीख का चयन नहीं किया जा सकता।');
        }
      }
    }, 300),
    []
  );

  // Load data on component mount
  useEffect(() => {
    const loadBaheeDetails = async () => {
      try {
        setLoading(true);
        const response = await baheeApiService.getAllBaheeDetails();

        if (response.success && response.data) {
          setAllSavedBaheeDetails(response.data);
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
    } else {
      const todayTithi = getAccurateHinduTithi(getTodayDate()[0]);
      setLocalDetailsForm(prev => ({ ...prev, tithi: todayTithi }));
      setDetailsForm(prev => ({ ...prev, tithi: todayTithi }));
    }

    // ✅ FIXED: Remove 'anya' from hardcoded disabled types
    const disableAmountTypes = ['odhawani', 'mahera'];
    setIsAmountDisabled(disableAmountTypes.includes(selectedBaheeType));
    
    // ✅ Set toggle state from route params for "anya" bahee
    if (selectedBaheeType === 'anya') {
      setUparnetToggle(initialToggleFromVigatBahee);
    }
  }, [selectedBaheeType, passedExisting, initialToggleFromVigatBahee]);

  // Handle bahee details form changes with debouncing
  const handleChangeBaheeDetails = useCallback((field: string, value: string) => {
    setLocalDetailsForm(prev => ({ ...prev, [field]: value }));
    setDetailsError('');

    if (field === 'date') {
      if (isValidDate(value)) {
        const calculatedTithi = getAccurateHinduTithi(value);
        setLocalDetailsForm(prev => ({ ...prev, tithi: calculatedTithi }));
        setDateError('');
      } else {
        setDateError('भविष्य की तारीख का चयन नहीं किया जा सकता।');
      }
    }

    debouncedUpdateDetailsForm(field, value);
  }, [debouncedUpdateDetailsForm]);

  // ✅ Handle toggle change - यह function रखा गया है par EntryForm में toggle show नहीं होता
  const handleToggleChange = (enabled: boolean) => {
    setUparnetToggle(enabled);
  };

  // Bahee details save handler
  const handleBaheeDetailsSave = async (e: FormEvent) => {
    e.preventDefault();
    const nameTrim = detailsForm.name.trim();

    if (!nameTrim || !detailsForm.date[0].trim() || !detailsForm.tithi.trim()) {
      setDetailsError('सभी विवरण अनिवार्य हैं।');
      return;
    }

    if (!isValidDate(detailsForm.date[0])) {
      setDetailsError('कृपया आज या इससे पहले की तारीख चुनें।');
      return;
    }

    try {
      setDetailsLoading(true);
      setDetailsError('');

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

        const updatedResponse = await baheeApiService.getAllBaheeDetails();
        if (updatedResponse.success && updatedResponse.data) {
          setAllSavedBaheeDetails(updatedResponse.data);
        }
      }
    } catch (error: any) {
      console.error('❌ Bahee Details Save Error:', error);
      if (error.message.includes('Network Error')) {
        setDetailsError('कृपया पुनः प्रयास करें');
      } else {
        setDetailsError(error.message || 'कुछ गलत हुआ है।');
      }
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleEntrySubmit = async (entryData: BaheeEntryCreateRequest) => {
    try {
      setEntryLoading(true);
      setSuccessMessage('');

      const response = await baheeApiService.createBaheeEntry(entryData);

      if (response.success) {
        setSuccessMessage('✅ Entry सफलतापूर्वक सेव हो गई!');
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (error: any) {
      console.error('❌ Entry Save Error:', error);
      alert(error.message || 'Error saving entry');
      throw error;
    } finally {
      setEntryLoading(false);
    }
  };

  const handleGoBack = () => navigate(-1);

  const handleNavigateToTable = () => {
    if (thisTypeBaheeDetails && thisTypeBaheeDetails.id) {
      navigate('/bahee-layout', {
        state: {
          selectedBaheeId: thisTypeBaheeDetails.id,
          baheeType: thisTypeBaheeDetails.baheeType,
          baheeTypeName: thisTypeBaheeDetails.baheeTypeName,
          existingBaheeData: thisTypeBaheeDetails,
          autoNavigateToInterface: true,
          fromEntries: true
        }
      });
    } else {
      navigate('/bahee-layout')
    }
  };

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

        {successMessage && (
          <div className="success-message-container">
            <div className="success-message">
              <span className="success-text">{successMessage}</span>
            </div>
          </div>
        )}

        {!thisTypeBaheeDetails && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🕉️</span>
                <h2 className="text-lg font-bold text-red-800 Hind-Regular">
                  {selectedBaheeTypeName} का विवरण जोड़ें
                </h2>
              </div>
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

            <form onSubmit={handleBaheeDetailsSave} className="space-y-4">
              <div className="bg-white/90 backdrop-blur rounded-2xl shadow-md p-4 sm:p-6 max-w-sm mx-auto sm:max-w-none">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      नाम
                    </label>
                    <ReactTransliterate
                      value={localDetailsForm.name}
                      onChangeText={(text) => handleChangeBaheeDetails('name', text)}
                      lang="hi"
                      placeholder="जैसे: दुदाराम"
                      className="w-full h-12 px-3 rounded-xl border border-gray-300 bg-white text-base placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition"
                      disabled={detailsLoading}
                      maxOptions={3}
                      showCurrentWordAsLastOption={false}
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      तारीख
                    </label>
                    <input
                      type="date"
                      value={localDetailsForm.date}
                      onChange={(e) => handleChangeBaheeDetails('date', e.target.value)}
                      // max={maxDate}
                      className={`w-full h-12 px-3 rounded-xl border bg-white text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition ${
                        dateError ? 'border-red-500 focus-visible:ring-red-600' : 'border-gray-300 focus-visible:ring-blue-600'
                      }`}
                      disabled={detailsLoading}
                    />
                    {dateError && (
                      <p className="text-xs text-red-600 mt-1">{dateError}</p>
                    )}
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      तिथि
                    </label>
                    <input
                      type="text"
                      value={localDetailsForm.tithi}
                      placeholder="हिंदू तिथि यहाँ दिखेगी"
                      className="w-full h-12 px-3 rounded-xl border border-gray-200 bg-blue-50 text-base text-blue-800 cursor-not-allowed font-medium"
                      disabled
                      readOnly
                    />
                    {localDetailsForm.date === getTodayDate() && (
                      <p className="text-xs text-green-600 mt-1">
                        ✅ आज: कृष्ण नवमी, आश्विन
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <button
                    type="submit"
                    disabled={detailsLoading || !!dateError}
                    className="h-12 w-full sm:w-auto px-5 rounded-xl text-white font-semibold shadow-sm bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {detailsLoading ? 'Saving...' : 'Save'}
                  </button>

                  {(detailsError || dateError) && (
                    <span role="alert" className="text-sm text-red-600">
                      {detailsError || dateError}
                    </span>
                  )}
                </div>
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

            <div className="bg-pink-700 rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                  <h1 className="text-lg font-bold text-blue-700 text-center sm:text-left">
                    नई Entries जोड़ें
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                    <h2 className="text-lg font-semibold text-blue-800">
                      {thisTypeBaheeDetails.baheeTypeName} — {thisTypeBaheeDetails.name}
                    </h2>
                  </div>
                  
                  <button
                    onClick={handleNavigateToTable}
                    disabled={entryLoading}
                    className="bg-white text-lg hover:bg-gray-200 text-blue-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    बही विवरण
                  </button>
                </div>
              </div>
            </div>

            {/* ✅ EntryForm - WITHOUT toggle UI (केवल state pass करते हैं) */}
            <EntryForm
              thisTypeBaheeDetails={thisTypeBaheeDetails}
              isAmountDisabled={isAmountDisabled}
              entryLoading={entryLoading}
              onSubmit={handleEntrySubmit}
              isAnyaBahee={isAnyaBahee}
              uparnetToggle={uparnetToggle}
              onToggleChange={handleToggleChange}
            />
          </>
        )}
      </div>
      <Footer/>

      {/* Mobile-First Responsive CSS */}
      <style>{`
        .success-message-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 0 1rem;
        }

        .success-message {
          background-color: #D1FAE5;
          border: 2px solid #10B981;
          color: #047857;
          border-radius: 0.75rem;
          padding: 1rem 1.5rem;
          box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.4), 0 10px 10px -5px rgba(16, 185, 129, 0.3);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          font-size: 1rem;
          max-width: 90vw;
          width: 100%;
          max-width: 400px;
          animation: mobilePopIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          text-align: center;
          justify-content: center;
        }

        @keyframes mobilePopIn {
          0% {
            opacity: 0;
            transform: scale(0.5) rotate(-10deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.1) rotate(5deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @media (min-width: 768px) {
          .success-message-container {
            position: relative;
            top: auto;
            left: auto;
            transform: none;
            z-index: auto;
            width: auto;
            padding: 0;
            margin-bottom: 1.5rem;
          }

          .success-message {
            position: relative;
            max-width: none;
            width: auto;
            animation: desktopSlideDown 0.5s ease-out;
            box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
          }
        }

        @keyframes desktopSlideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AddNewEntries;