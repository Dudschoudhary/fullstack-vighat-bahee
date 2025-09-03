import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VigatBaheeLayout from '../common/CustomVigatBaheeLogo';
import UserProfile from '../components/UserProfile';
import PasswordChangeModal from '../components/PasswordChangeModal';
import Loader from '../common/Loader';
import baheeApiService from '../services/baheeApiService';

interface BaheeDetails {
  id: string;
  baheeType: string;
  baheeTypeName: string;
  name: string;
  date: string;
  tithi: string;
  createdAt: string;
}

const getBaheeTypeName = (value: string) => {
  const baheeTypes: { [key: string]: string } = {
    vivah: 'विवाह की विगत',
    muklawa: 'मुकलावा की विगत',
    odhawani: 'ओढावणी की विगत',
    mahera: 'माहेरा की विगत',
    anya: 'अन्य विगत'
  };
  return baheeTypes[value] || '';
};

const VigatBahee = () => {
  const [firstSelectValue, setFirstSelectValue] = useState('');
  const [secondSelectValue, setSecondSelectValue] = useState('');
  const [thirdSelectValue, setThirdSelectValue] = useState('');
  const [savedHeaders, setSavedHeaders] = useState<BaheeDetails[]>([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // ✅ FIX: Navigation state management
  const [pendingNavigation, setPendingNavigation] = useState<{
    path: string;
    state: any;
  } | null>(null);
  
  const navigate = useNavigate();

  // ✅ FIX: Navigation in useEffect
  useEffect(() => {
    if (pendingNavigation) {
      console.log('🚀 Executing navigation:', pendingNavigation);
      
      // Small delay to ensure state is properly set
      const timer = setTimeout(() => {
        navigate(pendingNavigation.path, { 
          state: pendingNavigation.state,
          replace: true 
        });
        setPendingNavigation(null);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pendingNavigation, navigate]);

  // Load bahee details from API
  const loadBaheeDetails = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Loading Bahee Details from API...');
      
      const response = await baheeApiService.getAllBaheeDetails();
      
      if (response.success && response.data) {
        setSavedHeaders(response.data);
        console.log('✅ Loaded Bahee Details:', response.data);
        localStorage.setItem('baheeDetailsSavedArr', JSON.stringify(response.data));
      } else {
        throw new Error(response.message || 'Failed to load bahee details');
      }
    } catch (error: any) {
      console.error('❌ Error loading bahee details:', error);
      setError('डेटा लोड करने में समस्या हुई।');
      
      const saved = JSON.parse(localStorage.getItem('baheeDetailsSavedArr') || '[]') as BaheeDetails[];
      setSavedHeaders(saved);
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

  const handleFirstSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFirstSelectValue(e.target.value);
    if (e.target.value !== '') {
      setSecondSelectValue('');
      setThirdSelectValue('');
    }
  };

  // ✅ FIXED: Enhanced navigation with debugging
  const handleSecondSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    console.log('📋 Second select changed to:', selectedId);
    
    setSecondSelectValue(selectedId);

    if (selectedId !== '') {
      setFirstSelectValue('');
      setThirdSelectValue('');
      
      const selectedBahee = savedHeaders.find(h => h.id === selectedId);
      
      if (selectedBahee) {
        console.log('✅ Found selected bahee:', selectedBahee);
        
        // ✅ FIX: Set navigation state instead of direct navigate
        const navigationState = {
          selectedBaheeId: selectedBahee.id,
          baheeType: selectedBahee.baheeType,
          baheeTypeName: selectedBahee.baheeTypeName,
          existingBaheeData: selectedBahee,
          autoNavigateToInterface: true
        };

        console.log('🎯 Setting navigation state:', navigationState);
        
        setPendingNavigation({
          path: '/bahee-layout',
          state: navigationState
        });
      } else {
        console.error('❌ Selected bahee not found in savedHeaders');
      }
    }
  };

  const handleThirdSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setThirdSelectValue(e.target.value);
    if (e.target.value !== '') {
      setFirstSelectValue('');
      setSecondSelectValue('');
    }
  };

  const handleClearSelection = () => {
    setFirstSelectValue('');
    setSecondSelectValue('');
    setThirdSelectValue('');
    setPendingNavigation(null); // Clear pending navigation
  };

  const handleRefresh = () => {
    loadBaheeDetails();
  };

  const handleSubmit = () => {
    if (firstSelectValue !== '') {
      navigate('/new-bahee', {
        state: {
          baheeType: firstSelectValue,
          baheeTypeName: getBaheeTypeName(firstSelectValue)
        }
      });
      return;
    }
    
    if (secondSelectValue !== '') {
      console.log('Second select already handled in onChange');
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
            autoNavigateToInterface: true
          }
        });
      } else {
        navigate('/new-bahee', {
          state: {
            baheeType: thirdSelectValue,
            baheeTypeName: getBaheeTypeName(thirdSelectValue)
          }
        });
      }
      return;
    }
  };

  const isAnySelected = firstSelectValue !== '' || secondSelectValue !== '' || thirdSelectValue !== '';

  const groupedByType: Record<string, BaheeDetails[]> = savedHeaders.reduce((acc, cur) => {
    acc[cur.baheeType] = acc[cur.baheeType] || [];
    acc[cur.baheeType].push(cur);
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
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header with Profile */}
        <div className="flex justify-between items-center mb-6">
          <VigatBaheeLayout />
          <UserProfile />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && pendingNavigation && (
            <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded text-xs">
              🔄 Navigation Pending: {pendingNavigation.path}
            </div>
          )}

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

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={handleRefresh}
                className="text-red-700 hover:text-red-900 font-medium"
              >
                पुनः प्रयास करें
              </button>
            </div>
          )}

          {/* Data count display */}
          {savedHeaders.length > 0 && (
            <div className="mb-4 text-center">
              <span className="text-sm text-gray-600">
                कुल बही विवरण: <strong>{savedHeaders.length}</strong>
              </span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
            {/* First Select - नई बही */}
            <div className="w-full lg:w-80">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                नई बही का प्रकार चुनें
              </label>
              <select
                value={firstSelectValue}
                onChange={handleFirstSelectChange}
                disabled={secondSelectValue !== '' || thirdSelectValue !== '' || loading}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                  secondSelectValue !== '' || thirdSelectValue !== '' || loading ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                }`}
              >
                <option value="">नई बही जोड़ें +</option>
                <option value="vivah">विवाह की विगत जोड़े +</option>
                <option value="muklawa">मुकलावा की विगत जोड़े +</option>
                <option value="odhawani">ओढावणी की विगत जोड़े +</option>
                <option value="mahera">माहेरा की विगत जोड़े +</option>
                <option value="anya">अन्य विगत जोड़े +</option>
              </select>
            </div>

            <div className="flex items-center justify-center lg:flex-col lg:h-20">
              <div className="w-20 h-px bg-gray-300 lg:w-px lg:h-8"></div>
              <span className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-full lg:my-2">
                या
              </span>
              <div className="w-20 h-px bg-gray-300 lg:w-px lg:h-8"></div>
            </div>

            {/* Second Select - मौजूदा बही (FIXED with proper navigation) */}
            <div className="w-full lg:w-80">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                मौजूदा बही चुनें
                {savedHeaders.length > 0 && (
                  <span className="text-xs text-green-600 ml-1">({savedHeaders.length} बही मिली)</span>
                )}
              </label>
              <select
                value={secondSelectValue}
                onChange={handleSecondSelectChange} // ✅ FIXED: Now with proper navigation
                disabled={firstSelectValue !== '' || thirdSelectValue !== '' || loading}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                  firstSelectValue !== '' || thirdSelectValue !== '' || loading ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                }`}
              >
                <option value="">
                  {savedHeaders.length === 0 ? 'कोई बही उपलब्ध नहीं' : 'बही का विवरण देखे'}
                </option>
                {typeOrder.map(type => {
                  const headersOfType = groupedByType[type] || [];
                  if (headersOfType.length === 0) return null;
                  
                  return (
                    <optgroup key={type} label={`${getBaheeTypeName(type)} (${headersOfType.length})`}>
                      {headersOfType.map(h => (
                        <option key={h.id} value={h.id}>
                          {getBaheeTypeName(h.baheeType)} — {h.name}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>

            <div className="flex items-center justify-center lg:flex-col lg:h-20">
              <div className="w-20 h-px bg-gray-300 lg:w-px lg:h-8"></div>
              <span className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-full lg:my-2">
                या
              </span>
              <div className="w-20 h-px bg-gray-300 lg:w-px lg:h-8"></div>
            </div>

            {/* Third Select - प्रकार अनुसार */}
            <div className="w-full lg:w-80">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                प्रकार अनुसार चुनें
              </label>
              <select
                value={thirdSelectValue}
                onChange={handleThirdSelectChange}
                disabled={firstSelectValue !== '' || secondSelectValue !== '' || loading}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                  firstSelectValue !== '' || secondSelectValue !== '' || loading ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                }`}
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={handleSubmit}
              disabled={!isAnySelected || loading}
              className={`w-full sm:w-48 px-8 py-3 font-medium rounded-lg transition-colors duration-200 focus:outline-none shadow-md ${
                isAnySelected && !loading
                  ? 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-700 cursor-pointer transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit करें
            </button>

            <button
              onClick={handleClearSelection}
              disabled={!isAnySelected || loading}
              className={`w-full sm:w-48 px-8 py-3 font-medium rounded-lg transition-colors duration-200 focus:outline-none shadow-md ${
                isAnySelected && !loading
                  ? 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:bg-gray-700 cursor-pointer transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Clear करें
            </button>
          </div>

          {/* Summary Section */}
          {savedHeaders.length > 0 && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">बही सारांश</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                {typeOrder.map(type => (
                  <div key={type} className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">
                      {groupedByType[type]?.length || 0}
                    </div>
                    <div className="text-xs text-gray-600">{getBaheeTypeName(type)}</div>
                  </div>
                ))}
              </div>
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
    </div>
  );
};

export default VigatBahee;