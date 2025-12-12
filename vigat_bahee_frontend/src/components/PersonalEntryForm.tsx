import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import CustomVigatBaheeLogo from '../common/CustomVigatBaheeLogo';
import { IoMdArrowRoundBack } from "react-icons/io";
import 'react-transliterate/dist/index.css';

import PersonalBaheeApiService from '../services/personalbheeApiService';
import { getAccurateHinduTithi, getTodayDate } from '../utils/hinduCalendar';
import Loader from '../common/Loader';
import EntryForm from '../components/EntryForm';
import type {
  BaheeDetails,
  LocationState
} from '../types/bahee.types';
import Footer from '../google adsense/Footer';
import personalbheeApiService from '../services/personalbheeApiService';

const PersonalEntryForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const selectedBaheeType = state?.baheeType || 'personal';
  const selectedBaheeTypeName = state?.baheeTypeName || 'व्यक्तिगत बही';
  const passedExisting = state?.existingBaheeData;
  const initialToggleFromVigatBahee = state?.initialUparnetToggle || false;
  const fromThirdSelector = state?.fromThirdSelector || false;

  const [allSavedBaheeDetails, setAllSavedBaheeDetails] = useState<BaheeDetails[]>([]);
  const [thisTypeBaheeDetails, setThisTypeBaheeDetails] = useState<BaheeDetails | undefined>(undefined);

  
  const [loading, setLoading] = useState<boolean>(true);
  const [entryLoading, setEntryLoading] = useState<boolean>(false);
  
  const [uparnetToggle, setUparnetToggle] = useState<boolean>(initialToggleFromVigatBahee);
  
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isAmountDisabled, setIsAmountDisabled] = useState<boolean>(false);

  const isAnyaBahee = selectedBaheeType === 'anya';

  useEffect(() => {
    const loadBaheeDetails = async () => {
      try {
        setLoading(true);
        
        if (passedExisting) {
          setThisTypeBaheeDetails(passedExisting);
          setLoading(false);
          return;
        }

        const response = await personalbheeApiService.getPersonalAllBaheeEntries();

        if (response.success && response.data) {
          setAllSavedBaheeDetails(response.data);
          
          const existingPersonalBahee = response.data.find(
            (bahee: BaheeDetails) => bahee.baheeType === selectedBaheeType
          );
          
          if (existingPersonalBahee) {
            setThisTypeBaheeDetails(existingPersonalBahee);
          } else {
            const defaultBaheeDetails: BaheeDetails = {
              id: 'temp-personal-id',
              baheeType: selectedBaheeType,
              baheeTypeName: selectedBaheeTypeName,
              name: selectedBaheeTypeName, // ✅ Use baheeTypeName as name
              date: getTodayDate(),
              tithi: getAccurateHinduTithi(getTodayDate()),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            setThisTypeBaheeDetails(defaultBaheeDetails);
          }
        }
      } catch (error) {
        console.error('❌ Error loading bahee details:', error);
        const defaultBaheeDetails: BaheeDetails = {
          id: 'temp-personal-id',
          baheeType: selectedBaheeType,
          baheeTypeName: selectedBaheeTypeName,
          name: selectedBaheeTypeName,
          date: getTodayDate(),
          tithi: getAccurateHinduTithi(getTodayDate()),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setThisTypeBaheeDetails(defaultBaheeDetails);
      } finally {
        setLoading(false);
      }
    };

    loadBaheeDetails();

    const disableAmountTypes = ['odhawani', 'mahera'];
    setIsAmountDisabled(disableAmountTypes.includes(selectedBaheeType));
    
    if (selectedBaheeType === 'anya') {
      setUparnetToggle(initialToggleFromVigatBahee);
    }
  }, [selectedBaheeType, passedExisting, initialToggleFromVigatBahee, selectedBaheeTypeName]);

  const handleToggleChange = (enabled: boolean) => {
    setUparnetToggle(enabled);
  };

  const handleEntrySubmit = async (values: any) => {
    try {
      setEntryLoading(true);
      setSuccessMessage('');

      if (!thisTypeBaheeDetails) {
        console.error('❌ thisTypeBaheeDetails is undefined!');
        message.error('कृपया पहले बही विवरण भरें');
        return;
      }

      const entryData = {
        baheeType: thisTypeBaheeDetails.baheeType,
        baheeTypeName: thisTypeBaheeDetails.baheeTypeName,
        headerName: thisTypeBaheeDetails.name || thisTypeBaheeDetails.baheeTypeName,
        
        caste: values.caste || '',
        name: values.name || '',
        fatherName: values.fatherName || '',
        villageName: values.villageName || '',
        income: Number(values.income || 0),
        amount: Number(values.amount || 0),
      };

      console.log("dudaram values",values)

      const missingFields = [];
      if (!entryData.baheeType) missingFields.push('baheeType');
      if (!entryData.baheeTypeName) missingFields.push('baheeTypeName');
      if (!entryData.headerName) missingFields.push('headerName');
      if (!entryData.caste) missingFields.push('caste');
      if (!entryData.name) missingFields.push('name');
      if (!entryData.fatherName) missingFields.push('fatherName');
      if (!entryData.villageName) missingFields.push('villageName');

      if (missingFields.length > 0) {
        console.error('❌ Missing fields:', missingFields);
        message.error(`कृपया ये फील्ड भरें: ${missingFields.join(', ')}`);
        return;
      }

      const response = await PersonalBaheeApiService.personalCreateBaheeEntry(entryData);


      if (response.success) {
        setSuccessMessage('✅ Entry सफलतापूर्वक सेव हो गई!');
        message.success('Entry सफलतापूर्वक सेव हो गई!');
        
        setTimeout(() => setSuccessMessage(''), 4000);
        
      } else {
        console.error('❌ API returned success: false');
        message.error(response.message || 'Entry save नहीं हो सकी');
      }
    } catch (error: any) {
      console.error('❌ Submit Error:', error);
      console.error('❌ Error Response:', error.response?.data);
      message.error(error.message || 'Entry save करने में समस्या हुई');
    } finally {
      setEntryLoading(false);
    }
  };

  const handleGoBack = () => navigate(-1);

  const handleNavigateToTable = () => {
    if (thisTypeBaheeDetails && thisTypeBaheeDetails.id) {
      navigate('/view-entries', {
        state: {
          selectedBaheeId: thisTypeBaheeDetails.id,
          baheeType: thisTypeBaheeDetails.baheeType,
          baheeTypeName: thisTypeBaheeDetails.baheeTypeName,
          existingBaheeData: thisTypeBaheeDetails,
          autoNavigateToInterface: true,
          fromEntries: true,
          fromThirdSelector: fromThirdSelector || true
        }
      });
    } else {
      navigate('/view-entries');
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

        {thisTypeBaheeDetails && (
          <>
            <div className="flex justify-end mb-6 md:mt-10">
              <button
                onClick={handleGoBack}
                disabled={entryLoading}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IoMdArrowRoundBack className="text-xl group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Back</span>
              </button>
            </div>

            <div className="bg-gradient-to-r from-pink-700 to-pink-600 rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 shadow-sm">
                  <h1 className="text-lg font-bold text-blue-700 text-center sm:text-left">
                    नई Entries जोड़ें
                  </h1>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 shadow-sm">
                    <h2 className="text-lg font-semibold text-blue-800 text-center">
                      {thisTypeBaheeDetails.baheeTypeName} — {thisTypeBaheeDetails.name}
                    </h2>
                  </div>
                  
                  <button
                    onClick={handleNavigateToTable}
                    disabled={entryLoading}
                    className="bg-white text-lg hover:bg-gray-100 text-blue-700 font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    बही विवरण
                  </button>
                </div>
              </div>
            </div>

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

      <Footer />

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
          background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
          border: 2px solid #10B981;
          color: #047857;
          border-radius: 0.75rem;
          padding: 1rem 1.5rem;
          box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.4), 
                      0 10px 10px -5px rgba(16, 185, 129, 0.3);
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
            box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2),
                        0 2px 4px -1px rgba(16, 185, 129, 0.1);
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

export default PersonalEntryForm;