import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import UserProfile from '../components/UserProfile';
import PasswordChangeModal from '../components/PasswordChangeModal';
import Loader from '../common/Loader';
import baheeApiService from '../services/baheeApiService';
import Footer from '../google adsense/Footer';

interface BaheeDetails {
  id: string;
  baheeType: string;
  baheeTypeName: string;
  name: string;
  date: any;
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
  const [savedHeaders, setSavedHeaders] = useState<BaheeDetails[]>([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  console.log(error);

  const navigate = useNavigate();

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

  const typeOrder = ['vivah', 'muklawa', 'odhawani', 'mahera', 'anya'];

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

  if (loading && savedHeaders.length === 0) {
    return (
      <>
        <Header />
        <Loader
          size="large"
          text="बही विवरण लोड हो रहे हैं..."
          fullScreen={true}
          colors={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
        />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="w-full min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-3 sm:p-6 lg:p-8">
          <div className="flex justify-end mb-4">
            <UserProfile />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 lg:p-8">
            {loading && savedHeaders.length > 0 && (
              <div className="mb-4">
                <Loader
                  size="small"
                  text="अपडेट हो रहा है..."
                  colors={["#327fcd", "#32cd32"]}
                />
              </div>
            )}

            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-2 YatraOne-Regular">
                🙏 विगत बही Dashboard
              </h1>
              <p className="text-gray-600">
                अपनी बही का प्रबंधन करें - नई बही बनाएं, मौजूदा देखें या entries प्रबंधित करें
              </p>
            </div>

            {savedHeaders.length > 0 && (
              <div className="mb-6 text-center">
                <span className="text-sm sm:text-md text-blue-800 YatraOne-Regular">
                  कुल बही विवरण: <strong>{savedHeaders.length}</strong>
                </span>
              </div>
            )}

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => navigate('/existing-bahee')}
                className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-3xl mb-2">📚</div>
                <h3 className="text-lg font-semibold YatraOne-Regular">मौजूदा बही देखें</h3>
                <p className="text-sm text-blue-100 mt-1">सभी सहेजी गई बहियों को देखें</p>
              </button>

              <button
                onClick={() => navigate('/my-entries')}
                className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-3xl mb-2">📝</div>
                <h3 className="text-lg font-semibold YatraOne-Regular">आपकी Entries</h3>
                <p className="text-sm text-green-100 mt-1">अपनी डाली गई entries देखें</p>
              </button>

              <button
                onClick={() => navigate('/new-bahee', { 
                  state: { 
                    baheeType: 'vivah', 
                    baheeTypeName: 'विवाह की विगत' 
                  } 
                })}
                className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-3xl mb-2">➕</div>
                <h3 className="text-lg font-semibold YatraOne-Regular">नई बही बनाएं</h3>
                <p className="text-sm text-pink-100 mt-1">नई विगत बही जोड़ें</p>
              </button>
            </div>

            {savedHeaders.length > 0 ? (
              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 text-center">
                  बही विवरण सारांश
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4 text-center">
                  {typeOrder.map(type => (
                    <div key={type} className="bg-white p-2 sm:p-3 rounded-lg shadow-sm">
                      <div className="text-lg sm:text-2xl font-bold text-blue-600">
                        {groupedByType[type]?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600 YatraOne-Regular">
                        {getBaheeTypeName(type)}
                      </div>
                    </div>
                  ))}
                </div>

                {Object.values(groupedByType).flat().length !== savedHeaders.length && (
                  <div className="mt-3 p-2 bg-yellow-100 text-yellow-800 text-xs rounded">
                    ⚠️ कुछ डेटा वर्गीकृत नहीं है:{" "}
                    {savedHeaders.length - Object.values(groupedByType).flat().length} items
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-10 text-center p-6 bg-gray-50 rounded-lg border border-dashed">
                <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 tiroDevanagariSanskrit-Italic">
                  🙏 विगत बही में आपका हार्दिक स्वागत एवं अभिनंदन है।
                </h2>
                <p className="mt-2 text-sm">
                  अभी कोई बही विवरण उपलब्ध नहीं है।
                  नई एंट्री जोड़ने के लिए ऊपर दिए गए menu में <span className="font-medium text-red-600">"नई बही बनाएं"</span> पर क्लिक करें।
                </p>
              </div>
            )}
          </div>
        </div>

        <PasswordChangeModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          isMandatory={localStorage.getItem('isTemporaryPassword') === 'true'}
        />
      </div>
      <Footer />
    </>
  );
};

export default VigatBahee;