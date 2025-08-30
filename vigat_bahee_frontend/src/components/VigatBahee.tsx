import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VigatBaheeLayout from '../common/CustomVigatBaheeLogo';
import UserProfile from '../components/UserProfile';
import PasswordChangeModal from '../components/PasswordChangeModal';

interface BaheeDetails {
  id: string;
  baheeType: string;
  baheeTypeName: string;
  name: string;
  date: string;
  tithi: string;
  createdAt: string;
}

const BAHEE_DETAIL_KEY = 'baheeDetailsSavedArr';

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
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      navigate('/login');
      return;
    }

    // Check for temporary password requirement
    const isTemporaryPassword = localStorage.getItem('isTemporaryPassword') === 'true';
    const urlParams = new URLSearchParams(window.location.search);
    const changePasswordParam = urlParams.get('changePassword') === 'true';
    
    if (isTemporaryPassword || changePasswordParam) {
      setShowPasswordModal(true);
    }

    // Load saved headers
    const saved = JSON.parse(localStorage.getItem(BAHEE_DETAIL_KEY) || '[]') as BaheeDetails[];
    setSavedHeaders(saved);
  }, [navigate]);

  const handleFirstSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFirstSelectValue(e.target.value);
    if (e.target.value !== '') {
      setSecondSelectValue('');
      setThirdSelectValue('');
    }
  };

  const handleSecondSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSecondSelectValue(e.target.value);
    if (e.target.value !== '') {
      setFirstSelectValue('');
      setThirdSelectValue('');
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
  };

  const handleSubmit = () => {
    if (firstSelectValue !== '') {
      navigate('/new-entries', {
        state: {
          baheeType: firstSelectValue,
          baheeTypeName: getBaheeTypeName(firstSelectValue)
        }
      });
      return;
    }
    
    if (secondSelectValue !== '') {
      const existing = savedHeaders.find(h => h.id === secondSelectValue);
      if (existing) {
        navigate('/new-entries', {
          state: {
            baheeType: existing.baheeType,
            baheeTypeName: existing.baheeTypeName,
            existingBaheeData: existing
          }
        });
      }
      return;
    }
    
    if (thirdSelectValue !== '') {
      const existing = savedHeaders.find(h => h.baheeType === thirdSelectValue);
      if (existing) {
        navigate('/new-entries', {
          state: {
            baheeType: existing.baheeType,
            baheeTypeName: existing.baheeTypeName,
            existingBaheeData: existing
          }
        });
      } else {
        navigate('/new-entries', {
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

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header with Profile */}
        <div className="flex justify-between items-center mb-6">
          <VigatBaheeLayout />
          <UserProfile />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
            {/* First Select - नई बही */}
            <div className="w-full lg:w-80">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                नई बही का प्रकार चुनें
              </label>
              <select
                value={firstSelectValue}
                onChange={handleFirstSelectChange}
                disabled={secondSelectValue !== '' || thirdSelectValue !== ''}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                  secondSelectValue !== '' || thirdSelectValue !== '' ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
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

            {/* Second Select */}
            <div className="w-full lg:w-80">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                मौजूदा बही चुनें
              </label>
              <select
                value={secondSelectValue}
                onChange={handleSecondSelectChange}
                disabled={firstSelectValue !== '' || thirdSelectValue !== ''}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                  firstSelectValue !== '' || thirdSelectValue !== '' ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                }`}
              >
                <option value="">बही का विवरण देखे</option>
                {typeOrder.map(type => (
                  <optgroup key={type} label={getBaheeTypeName(type)}>
                    {(groupedByType[type] || []).map(h => (
                      <option key={h.id} value={h.id}>
                        {getBaheeTypeName(h.baheeType)} — {h.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center lg:flex-col lg:h-20">
              <div className="w-20 h-px bg-gray-300 lg:w-px lg:h-8"></div>
              <span className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-full lg:my-2">
                या
              </span>
              <div className="w-20 h-px bg-gray-300 lg:w-px lg:h-8"></div>
            </div>

            {/* Third Select */}
            <div className="w-full lg:w-80">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                आपके द्वारा डाली गई बही
              </label>
              <select
                value={thirdSelectValue}
                onChange={handleThirdSelectChange}
                disabled={firstSelectValue !== '' || secondSelectValue !== ''}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                  firstSelectValue !== '' || secondSelectValue !== '' ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                }`}
              >
                <option value="">आपके द्वारा डाली गई बही</option>
                <option value="vivah">विवाह की विगत</option>
                <option value="muklawa">मुकलावा की विगत</option>
                <option value="odhawani">ओढावणी की विगत</option>
                <option value="mahera">माहेरा की विगत</option>
                <option value="anya">अन्य विगत</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={handleSubmit}
              disabled={!isAnySelected}
              className={`w-full sm:w-48 px-8 py-3 font-medium rounded-lg transition-colors duration-200 focus:outline-none shadow-md ${
                isAnySelected
                  ? 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-700 cursor-pointer transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit करें
            </button>

            <button
              onClick={handleClearSelection}
              disabled={!isAnySelected}
              className={`w-full sm:w-48 px-8 py-3 font-medium rounded-lg transition-colors duration-200 focus:outline-none shadow-md ${
                isAnySelected
                  ? 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:bg-gray-700 cursor-pointer transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Clear करें
            </button>
          </div>
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