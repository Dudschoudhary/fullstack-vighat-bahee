import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from '../google adsense/Footer';
import Loader from '../common/Loader';

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

const MyEntries: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const typeOrder = ['vivah', 'muklawa', 'odhawani', 'mahera', 'anya'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: '/my-entries' } });
      return;
    }
  }, [navigate]);

  const handleTypeSelect = (type: string) => {
    setLoading(true);
    navigate('/view-entries', {
      state: {
        baheeType: type,
        baheeTypeName: getBaheeTypeName(type),
        fromThirdSelector: true
      }
    });
  };

  const typeIcons: { [key: string]: string } = {
    vivah: '💒',
    muklawa: '🎊',
    odhawani: '👘',
    mahera: '🎁',
    anya: '📝'
  };

  const typeDescriptions: { [key: string]: string } = {
    vivah: 'शादी-विवाह से संबंधित सभी entries देखें',
    muklawa: 'मुकलावा से संबंधित सभी entries देखें',
    odhawani: 'ओढावणी से संबंधित सभी entries देखें',
    mahera: 'माहेरा से संबंधित सभी entries देखें',
    anya: 'अन्य सभी प्रकार की entries देखें'
  };

  if (loading) {
    return (
      <>
        <Header />
        <Loader
          size="large"
          text="Entries लोड हो रही हैं..."
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-blue-800 mb-2 YatraOne-Regular text-center">
              आपके द्वारा डाली गई बही देखें
            </h1>
            <p className="text-gray-600 text-center mb-8">
              बही प्रकार चुनें और अपनी सभी entries देखें
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {typeOrder.map(type => (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className="group p-6 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform">
                      {typeIcons[type]}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 YatraOne-Regular">
                      {getBaheeTypeName(type)}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 group-hover:text-gray-700">
                    {typeDescriptions[type]}
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">देखें</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Info Box */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">सहायता</h4>
                  <p className="text-sm text-blue-700">
                    किसी भी प्रकार पर क्लिक करें उस प्रकार की सभी entries देखने के लिए। 
                    आप वहां से अपनी entries को खोज सकते हैं, संपादित कर सकते हैं और प्रबंधित कर सकते हैं।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyEntries;
