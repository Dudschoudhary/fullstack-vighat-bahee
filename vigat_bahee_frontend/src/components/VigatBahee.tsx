import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import VigatBaheeLayout from '../common/CustomVigatBaheeLogo';
import UserProfile from '../components/UserProfile';
import PasswordChangeModal from '../components/PasswordChangeModal';
import Loader from '../common/Loader';
import { ReactTransliterate } from 'react-transliterate';
import baheeApiService from '../services/baheeApiService';
import Footer from '../google adsense/Footer';

interface BaheeDetails {
  id: string;
  baheeType: string;
  baheeTypeName: string;
  name: string;
  date: string;
  tithi: string;
  createdAt: string;
  baheeDetails_ids: any
}

const getBaheeTypeName = (value: string) => {
  const baheeTypes: { [key: string]: string } = {
    vivah: 'विवाह की विगत',
    muklawa: 'मुकलावा की विगत',
    odhawani: 'ओढावणी की विगत',
    mahera: 'माहेरा की विगत',
    anya: 'अन्य विगत'
  };
  return baheeTypes[value?.toLowerCase()] || value || '';
};

const VigatBahee = () => {
  const [firstSelectValue, setFirstSelectValue] = useState('');
  const [secondSelectValue, setSecondSelectValue] = useState('');
  const [thirdSelectValue, setThirdSelectValue] = useState('');
  const [savedHeaders, setSavedHeaders] = useState<BaheeDetails[]>([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // ✅ Custom input states for "अन्य विगत"
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customBaheeType, setCustomBaheeType] = useState('');

  // ✅ NEW: Toggle state for Vigat Bahee main page - यहाँ है toggle!
  const [showToggleInVigatBahee, setShowToggleInVigatBahee] = useState(false);
  const [vigatBaheeToggle, setVigatBaheeToggle] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Restore previous selections when coming back
  useEffect(() => {
    const savedState = location.state;
    if (savedState?.returnFromBaheeLayout) {
      if (savedState.previousFirstSelect) setFirstSelectValue(savedState.previousFirstSelect);
      if (savedState.previousSecondSelect) setSecondSelectValue(savedState.previousSecondSelect);
      if (savedState.previousThirdSelect) setThirdSelectValue(savedState.previousThirdSelect);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.state]);

  // Enhanced data loading
  const loadBaheeDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await baheeApiService.getAllBaheeDetails();

      if (response.success && response.data) {
        const rawData = (response.data as any).baheeDetails_ids || [];

        const processedData = rawData.map((item: any, index: number) => {
          const processed = {
            id: item.id || item._id || `temp_${index}`,
            baheeType: (item.baheeType || item.type || '').toLowerCase().trim(),
            baheeTypeName: item.baheeTypeName || getBaheeTypeName(item.baheeType || item.type || ''),
            name: item.name || item.title || `बिना नाम ${index + 1}`,
            date: item.date || '',
            tithi: item.tithi || '',
            createdAt: item.createdAt || item.created_at || ''
          };

          if (!processed.baheeType) {
            console.warn('⚠️ Missing baheeType for item:', item);
            processed.baheeType = 'anya';
            processed.baheeTypeName = 'अन्य विगत';
          }

          return processed;
        }).filter((item: any) => item.id && item.name);

        setSavedHeaders(processedData);
        localStorage.setItem('baheeDetailsSavedArr', JSON.stringify({
          ...response.data,
          baheeDetails_ids: processedData
        }));
      } else {
        throw new Error(response.message || 'Failed to load bahee details');
      }
    } catch (error: any) {
      console.error('❌ Error loading bahee details:', error);
      setError('डेटा लोड करने में समस्या हुई।');

      try {
        const saved = JSON.parse(localStorage.getItem('baheeDetailsSavedArr') || '{}');
        const fallbackData = saved.baheeDetails_ids || [];
        if (fallbackData.length > 0) {
          setSavedHeaders(fallbackData);
        } else {
          setSavedHeaders([]);
        }
      } catch (e) {
        setSavedHeaders([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      navigate('/login');
      return;
    }

    const isTemporaryPassword = localStorage.getItem('isTemporaryPassword') === 'true';
    const urlParams = new URLSearchParams(window.location.search);
    const changePasswordParam = urlParams.get('changePassword') === 'true';

    if (isTemporaryPassword || changePasswordParam) {
      setShowPasswordModal(true);
    }

    loadBaheeDetails();
  }, [navigate]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadBaheeDetails();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // ✅ Handle first select change with custom input and toggle logic
  const handleFirstSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setFirstSelectValue(selectedValue);

    if (selectedValue !== '') {
      setSecondSelectValue('');
      setThirdSelectValue('');

      // ✅ Show custom input and toggle for "अन्य विगत"
      if (selectedValue === 'anya') {
        setShowCustomInput(true);
        setShowToggleInVigatBahee(true);
        setCustomBaheeType('');
        setVigatBaheeToggle(true); // Default disabled
      } else {
        setShowCustomInput(false);
        setShowToggleInVigatBahee(false);
        setCustomBaheeType('');
        setVigatBaheeToggle(false);
      }
    } else {
      setShowCustomInput(false);
      setShowToggleInVigatBahee(false);
      setCustomBaheeType('');
      setVigatBaheeToggle(false);
    }
  };

  const handleSecondSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSecondSelectValue(selectedId);

    if (selectedId !== '') {
      setFirstSelectValue('');
      setThirdSelectValue('');
      setShowCustomInput(false);
      setShowToggleInVigatBahee(false);
      setCustomBaheeType('');
      setVigatBaheeToggle(false);
    }
  };

  const handleThirdSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setThirdSelectValue(selectedValue);

    if (selectedValue !== '') {
      setFirstSelectValue('');
      setSecondSelectValue('');
      
      // ✅ Show toggle for "anya" in third select too
      if (selectedValue === 'anya') {
        setShowToggleInVigatBahee(true);
        setVigatBaheeToggle(false); // Default disabled
      } else {
        setShowToggleInVigatBahee(false);
        setVigatBaheeToggle(false);
      }
      
      setShowCustomInput(false);
      setCustomBaheeType('');
    }
  };

  // Clear all selections including custom input and toggle
  const handleClearSelection = () => {
    setFirstSelectValue('');
    setSecondSelectValue('');
    setThirdSelectValue('');
    setShowCustomInput(false);
    setShowToggleInVigatBahee(false);
    setCustomBaheeType('');
    setVigatBaheeToggle(false);
  };

  // ✅ Handle toggle change in main page
  const handleVigatBaheeToggleChange = (checked: boolean) => {
    setVigatBaheeToggle(checked);
  };

  // ✅ Handle submit with toggle state passing
  const handleSubmit = () => {
    const currentSelections = {
      previousFirstSelect: firstSelectValue,
      previousSecondSelect: secondSelectValue,
      previousThirdSelect: thirdSelectValue
    };

    if (firstSelectValue !== '') {
      // Handle custom bahee type for "अन्य विगत"
      if (firstSelectValue === 'anya' && customBaheeType.trim()) {
        navigate('/new-bahee', {
          state: {
            baheeType: 'anya',
            baheeTypeName: customBaheeType.trim(),
            customBaheeTypeName: customBaheeType.trim(),
            // ✅ Pass toggle state from VigatBahee page
            initialUparnetToggle: vigatBaheeToggle,
            ...currentSelections
          }
        });
        return;
      } else if (firstSelectValue !== 'anya') {
        navigate('/new-bahee', {
          state: {
            baheeType: firstSelectValue,
            baheeTypeName: getBaheeTypeName(firstSelectValue),
            ...currentSelections
          }
        });
        return;
      }
    }

    if (secondSelectValue !== '') {
      const selectedBahee = savedHeaders.find(h => h.id === secondSelectValue);

      if (selectedBahee) {
        const navigationState = {
          selectedBaheeId: selectedBahee.id,
          baheeType: selectedBahee.baheeType,
          baheeTypeName: selectedBahee.baheeTypeName,
          existingBaheeData: selectedBahee,
          autoNavigateToInterface: true,
          ...currentSelections
        };

        navigate('/bahee-layout', {
          state: navigationState,
          replace: false
        });
      } else {
        console.error('❌ Selected bahee not found in savedHeaders');
      }
      return;
    }

    if (thirdSelectValue !== '') {
      const existing = savedHeaders.find(h => h.baheeType === thirdSelectValue);
      if (existing) {
        navigate('/bahee-layout', {
          state: {
            baheeType: existing.baheeType,
            baheeTypeName: existing.baheeTypeName,
            selectedBaheeId: existing.id,
            existingBaheeData: existing,
            autoNavigateToInterface: true,
            ...currentSelections
          }
        });
      } else {
        navigate('/new-bahee', {
          state: {
            baheeType: thirdSelectValue,
            baheeTypeName: getBaheeTypeName(thirdSelectValue),
            // ✅ Pass toggle state for "anya" type
            initialUparnetToggle: thirdSelectValue === 'anya' ? vigatBaheeToggle : undefined,
            ...currentSelections
          }
        });
      }
      return;
    }
  };

  // Check if any selection is made including custom input and toggle
  const isAnySelected = firstSelectValue !== '' || secondSelectValue !== '' || thirdSelectValue !== '';
  const isCustomInputComplete = showCustomInput && customBaheeType.trim().length > 0;
  const canSubmit = (isAnySelected && !showCustomInput) || isCustomInputComplete;

  // Robust grouping with comprehensive validation
  const groupedByType: Record<string, BaheeDetails[]> = savedHeaders.reduce((acc, cur) => {
    if (cur && typeof cur === 'object' && cur.baheeType) {
      const baheeType = cur.baheeType.toLowerCase().trim();
      const validTypes = ['vivah', 'muklawa', 'odhawani', 'mahera', 'anya'];
      const finalType = validTypes.includes(baheeType) ? baheeType : 'anya';

      acc[finalType] = acc[finalType] || [];
      acc[finalType].push(cur);
    } else {
      console.warn('⚠️ Skipping invalid entry:', cur);
    }
    return acc;
  }, {} as Record<string, BaheeDetails[]>);

  const typeOrder = ['vivah', 'muklawa', 'odhawani', 'mahera', 'anya'];

  if (loading && savedHeaders.length === 0) {
    return (
      <Loader
        size="large"
        text="बही विवरण लोड हो रहे हैं..."
        fullScreen={true}
        colors={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
      />
    );
  }

  return (
    <>
      <div className="w-full min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-3 sm:p-6 lg:p-8">
          {/* Header with Profile */}
          <div className="sticky top-0 z-50 bg-white shadow-md rounded-lg mb-4 sm:mb-6 p-3 lg:p-0 lg:bg-transparent lg:shadow-none lg:static">
            <div className="flex justify-between items-center">
              <VigatBaheeLayout />
              <UserProfile />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 lg:p-8">
            {/* Loading indicator for refresh */}
            {loading && savedHeaders.length > 0 && (
              <div className="mb-4">
                <Loader
                  size="small"
                  text="अपडेट हो रहा है..."
                  colors={["#327fcd", "#32cd32"]}
                />
              </div>
            )}

            {/* Data count display */}
            {savedHeaders.length > 0 && (
              <div className="mb-4 text-center">
                <span className="text-sm sm:text-md text-blue-800 YatraOne-Regular">
                  कुल बही विवरण: <strong>{savedHeaders.length}</strong>
                </span>
              </div>
            )}

            {/* Main Selection Area */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-0 lg:flex lg:flex-row lg:items-center lg:justify-center lg:gap-8">
              {/* First Select - नई बही */}
              <div className="w-full lg:w-80">
                <label className="block text-lg sm:text-base lg:text-lg font-medium text-red-700 mb-2 YatraOne-Regular">
                  नई बही का प्रकार चुनें
                </label>
                <select
                  value={firstSelectValue}
                  onChange={handleFirstSelectChange}
                  disabled={secondSelectValue !== '' || thirdSelectValue !== '' || loading}
                  className={`w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base ${secondSelectValue !== '' || thirdSelectValue !== '' || loading ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
                >
                  <option value="">नई बही जोड़ें +</option>
                  <option value="vivah">विवाह की विगत जोड़े +</option>
                  <option value="muklawa">मुकलावा की विगत जोड़े +</option>
                  <option value="odhawani">ओढावणी की विगत जोड़े +</option>
                  <option value="mahera">माहेरा की विगत जोड़े +</option>
                  <option value="anya">अन्य विगत जोड़े +</option>
                </select>

                {/* ✅ Custom Input Box for "अन्य विगत" */}
                {showCustomInput && (
                  <div className="mt-3 animate-fade-in">
                    <label className="text-lg sm:text-base lg:text-lg font-medium text-blue-700 mb-2 YatraOne-Regular">
                      अपना विगत प्रकार लिखें:
                    </label>
                    <ReactTransliterate
                      value={customBaheeType}
                      onChangeText={(text) => setCustomBaheeType(text)}
                      lang="hi"
                      placeholder="विगत..."
                      className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                      style={{
                        fontSize: '14px',
                        fontFamily: 'inherit'
                      }}
                    />
                    {/* {customBaheeType.trim().length > 0 && (
                      <div className="mt-2 text-xs text-green-600">
                        ✓ आपका विगत प्रकार: <strong>{customBaheeType}</strong>
                      </div>
                    )} */}
                  </div>
                )}
              </div>

              {/* Desktop Separator */}
              <div className="hidden lg:flex items-center justify-center lg:flex-col lg:h-20">
                <div className="w-20 h-px bg-gray-300 lg:w-px lg:h-8"></div>
                <span className="px-4 py-2 bg-blue-800 text-white text-sm font-medium rounded-full lg:my-2">
                  या
                </span>
                <div className="w-20 h-px bg-gray-300 lg:w-px lg:h-8"></div>
              </div>

              {/* Mobile separator */}
              <div className="flex lg:hidden items-center justify-center w-full my-3">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-3 py-1 bg-blue-800 text-white text-xs font-medium rounded-full mx-3">
                  या
                </span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Second Select */}
              <div className="w-full lg:w-80">
                <label className="block text-lg sm:text-base lg:text-lg font-medium text-red-700 mb-2 YatraOne-Regular">
                  मौजूदा बही चुनें
                  {savedHeaders.length > 0 && (
                    <span className="text-xs text-green-600 ml-1">({savedHeaders.length} बही मिली)</span>
                  )}
                </label>
                <select
                  value={secondSelectValue}
                  onChange={handleSecondSelectChange}
                  disabled={firstSelectValue !== '' || thirdSelectValue !== '' || loading}
                  className={`w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base ${firstSelectValue !== '' || thirdSelectValue !== '' || loading ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
                >
                  <option value="">
                    {savedHeaders.length === 0 ? 'कोई बही उपलब्ध नहीं' : 'बही का विवरण देखे'}
                  </option>

                  {savedHeaders.length > 0 && Object.keys(groupedByType).length > 0 ? (
                    typeOrder.map(type => {
                      const headersOfType = groupedByType[type] || [];
                      if (headersOfType.length === 0) return null;

                      return (
                        <optgroup key={type} label={`${getBaheeTypeName(type)} (${headersOfType.length})`}>
                          {headersOfType.map(h => (
                            <option key={h.id} value={h.id}>
                              {h.name}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })
                  ) : (
                    savedHeaders.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.name} — {h.baheeTypeName}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Desktop Separator */}
              <div className="hidden lg:flex items-center justify-center lg:flex-col lg:h-20">
                <div className="w-20 h-px bg-gray-300 lg:w-px lg:h-8"></div>
                <span className="px-4 py-2 bg-blue-800 text-white text-sm font-medium rounded-full lg:my-2">
                  या
                </span>
                <div className="w-20 h-px bg-gray-300 lg:w-px lg:h-8"></div>
              </div>

              {/* Mobile separator */}
              <div className="flex lg:hidden items-center justify-center w-full my-3">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-3 py-1 bg-blue-800 text-white text-xs font-medium rounded-full mx-3">
                  या
                </span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Third Select - प्रकार अनुसार */}
              <div className="w-full lg:w-80">
                <label className="block text-lg sm:text-base lg:text-lg font-medium text-red-700 mb-2 YatraOne-Regular">
                  प्रकार अनुसार चुनें
                </label>
                <select
                  value={thirdSelectValue}
                  onChange={handleThirdSelectChange}
                  disabled={firstSelectValue !== '' || secondSelectValue !== '' || loading}
                  className={`w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base ${firstSelectValue !== '' || secondSelectValue !== '' || loading ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
                >
                  <option value="">बही प्रकार चुनें</option>
                  {typeOrder.map(type => (
                    <option key={type} value={type}>
                      {getBaheeTypeName(type)}
                      {groupedByType[type] && ` (${groupedByType[type].length})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ✅ Toggle Button Section - केवल यहाँ VigatBahee page पर */}
            {showToggleInVigatBahee && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-800">ऊपर नेत <span className='text-red-700 test-[8px]'>(क्या आपके इस बही के लिए ऊपर नेट की Entries रहेगी ?)</span></h3>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vigatBaheeToggle}
                      onChange={(e) => handleVigatBaheeToggleChange(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`relative inline-block w-14 h-8 transition-colors duration-200 ease-in-out rounded-full ${
                      vigatBaheeToggle ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                        vigatBaheeToggle ? 'transform translate-x-6' : ''
                      }`}></div>
                    </div>
                    <span className={`ml-3 font-medium ${vigatBaheeToggle ? 'text-green-700' : 'text-gray-600'}`}>
                      {vigatBaheeToggle ? 'हाँ' : 'नहीं'}
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Enhanced buttons logic for custom input and toggle */}
            {canSubmit && (
              <div className="mt-6 space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:items-center sm:justify-center sm:gap-4 animate-fade-in">
                <button
                  onClick={handleSubmit}
                  disabled={loading || (showCustomInput && customBaheeType.trim().length === 0)}
                  className={`w-full sm:w-48 px-4 py-3 font-semibold rounded-lg transition-all duration-300 focus:outline-none shadow-lg text-sm sm:text-base focus:ring-2 focus:ring-offset-2 cursor-pointer transform hover:scale-105 hover:shadow-xl ${loading || (showCustomInput && customBaheeType.trim().length === 0)
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 active:bg-blue-700'
                    }`}
                >
                  {loading ? 'Loading...' : 'Submit करें'}
                </button>

                <button
                  onClick={handleClearSelection}
                  disabled={loading}
                  className="w-full sm:w-48 px-4 py-3 font-semibold rounded-lg transition-all duration-300 focus:outline-none shadow-lg text-sm sm:text-base bg-gray-500 hover:bg-gray-600 text-white focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:bg-gray-700 cursor-pointer transform hover:scale-105 hover:shadow-xl"
                >
                  Clear करें
                </button>
              </div>
            )}

            {/* Enhanced Summary Section */}
            {savedHeaders.length > 0 && (
              <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3">बही सारांश</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4 text-center">
                  {typeOrder.map(type => (
                    <div key={type} className="bg-white p-2 sm:p-3 rounded-lg shadow-sm">
                      <div className="text-lg sm:text-2xl font-bold text-blue-600">
                        {groupedByType[type]?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600">{getBaheeTypeName(type)}</div>
                    </div>
                  ))}
                </div>

                {savedHeaders.length > 0 && Object.values(groupedByType).flat().length !== savedHeaders.length && (
                  <div className="mt-3 p-2 bg-yellow-100 text-yellow-800 text-xs rounded">
                    ⚠️ कुछ डेटा वर्गीकृत नहीं है: {savedHeaders.length - Object.values(groupedByType).flat().length} items
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Password Change Modal */}
        <PasswordChangeModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          isMandatory={localStorage.getItem('isTemporaryPassword') === 'true'}
        />

        {/* Custom CSS for animations and mobile optimization */}
        <style>{`
        .animate-fade-in {
          animation: fadeInUp 0.4s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Mobile specific optimizations */
        @media (max-width: 640px) {
          .sticky {
            margin-left: -12px;
            margin-right: -12px;
            border-radius: 0;
          }
        }
      `}</style>
      </div>
      <Footer />
    </>
  );
};

export default VigatBahee;