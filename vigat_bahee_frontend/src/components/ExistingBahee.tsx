import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from '../google adsense/Footer';
import Loader from '../common/Loader';
import baheeApiService from '../services/baheeApiService';

interface BaheeDetails {
  id: string;
  baheeType: string;
  baheeTypeName: string;
  name: string;
  date: any;
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
  return baheeTypes[value?.toLowerCase()] || value || '';
};

// Format date to DD.MM.YYYY format
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return dateString;
  }
};

const ExistingBahee: React.FC = () => {
  const [savedHeaders, setSavedHeaders] = useState<BaheeDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const typeOrder = ['vivah', 'muklawa', 'odhawani', 'mahera', 'anya'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: '/existing-bahee' } });
      return;
    }
    loadBaheeDetails();
  }, [navigate]);

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
            processed.baheeType = 'anya';
            processed.baheeTypeName = 'अन्य विगत';
          }

          return processed;
        }).filter((item: any) => item.id && item.name);

        setSavedHeaders(processedData);
      } else {
        throw new Error(response.message || 'Failed to load bahee details');
      }
    } catch (error: any) {
      console.error('Error loading bahee details:', error);
      setError('डेटा लोड करने में समस्या हुई।');
      setSavedHeaders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBaheeSelect = (bahee: BaheeDetails) => {
    navigate('/bahee-layout', {
      state: {
        selectedBaheeId: bahee.id,
        baheeType: bahee.baheeType,
        baheeTypeName: bahee.baheeTypeName,
        existingBaheeData: bahee,
        autoNavigateToInterface: true
      }
    });
  };

  const groupedByType: Record<string, BaheeDetails[]> = savedHeaders.reduce((acc, cur) => {
    if (cur && typeof cur === 'object' && cur.baheeType) {
      const baheeType = cur.baheeType.toLowerCase().trim();
      const validTypes = ['vivah', 'muklawa', 'odhawani', 'mahera', 'anya'];
      const finalType = validTypes.includes(baheeType) ? baheeType : 'anya';

      acc[finalType] = acc[finalType] || [];
      acc[finalType].push(cur);
    }
    return acc;
  }, {} as Record<string, BaheeDetails[]>);

  if (loading) {
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
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-blue-800 mb-2 YatraOne-Regular text-center">
              मौजूदा बही देखें
            </h1>
            <p className="text-gray-600 text-center mb-6">
              अपनी सभी सहेजी गई बहियों को यहाँ देखें और प्रबंधित करें
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
                <button 
                  onClick={loadBaheeDetails}
                  className="ml-4 text-red-800 underline hover:no-underline"
                >
                  पुनः प्रयास करें
                </button>
              </div>
            )}

            {savedHeaders.length > 0 && (
              <div className="mb-6 text-center">
                <span className="text-sm text-blue-800 YatraOne-Regular">
                  कुल बही विवरण: <strong>{savedHeaders.length}</strong>
                </span>
              </div>
            )}

            {savedHeaders.length === 0 && !error ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  कोई बही उपलब्ध नहीं है
                </h2>
                <p className="text-gray-500 mb-6">
                  अभी तक कोई बही नहीं बनाई गई है। नई बही बनाने के लिए नीचे क्लिक करें।
                </p>
                <button
                  onClick={() => navigate('/bahee')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  नई बही बनाएं
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {typeOrder.map(type => {
                  const bahees = groupedByType[type] || [];
                  if (bahees.length === 0) return null;

                  return (
                    <div key={type} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
                        <h3 className="text-white font-semibold YatraOne-Regular flex items-center gap-2">
                          <span>
                            {type === 'vivah' && '💒'}
                            {type === 'muklawa' && '🎊'}
                            {type === 'odhawani' && '👘'}
                            {type === 'mahera' && '🎁'}
                            {type === 'anya' && '📝'}
                          </span>
                          {getBaheeTypeName(type)} ({bahees.length})
                        </h3>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {bahees.map((bahee) => (
                          <button
                            key={bahee.id}
                            onClick={() => handleBaheeSelect(bahee)}
                            className="w-full px-4 py-4 text-left hover:bg-blue-50 transition-colors flex items-center justify-between group"
                          >
                            <div>
                              <h4 className="font-medium text-gray-800 group-hover:text-blue-700">
                                {bahee.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {bahee.date && `तारीख: ${formatDate(bahee.date)}`}
                                {bahee.tithi && ` | तिथि: ${bahee.tithi}`}
                              </p>
                            </div>
                            <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              देखें →
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Statistics */}
            {savedHeaders.length > 0 && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 text-center">
                  बही विवरण सारांश
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                  {typeOrder.map(type => (
                    <div key={type} className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-blue-600">
                        {groupedByType[type]?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600 YatraOne-Regular">
                        {getBaheeTypeName(type)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ExistingBahee;
