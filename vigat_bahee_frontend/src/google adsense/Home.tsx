import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomVigatBaheeLogo from '../common/CustomVigatBaheeLogo';
import Footer from './Footer';
import ganeshImg from '../assets/images/ganeshji1.png';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const goToLogin = () => navigate('/login');
  const goToSignup = () => navigate('/login', { state: { initMode: 'register' } });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      <div className="max-w-6xl mx-auto w-full p-6 flex-1">
        <div className="flex justify-center mb-6">
          <CustomVigatBaheeLogo />
        </div>

        <main className="mt-6 bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          <div className="flex justify-end items-center gap-4 mb-6">
            <button
              onClick={goToLogin}
              aria-label="Login to your account"
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              Login
            </button>

            <button
              onClick={goToSignup}
              aria-label="Create a new account"
              className="px-5 py-2 bg-pink-600 text-white rounded-md font-semibold hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              Sign Up
            </button>
          </div>

          {/* Polished hero: two-column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center text-center md:text-left mb-10">

            <div className="flex justify-center md:justify-center">
              <img src={ganeshImg} alt="गणेश जी" className="w-50 sm:w-60 md:w-80 rounded-lg shadow-lg object-contain" />
            </div>

            <div>
              <div className='flex justify-center items-center mb-7'>
              <h1 className='text-red-500 mb-7 text-lg'>"विघ्न हरण मंगल करण,
                श्री गणपति महाराज,<br/>
                प्रथम निमंत्रण आपको,
                मेरे पूरण करिये काज।।"</h1>

                </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-4 YatraOne-Regular">विगत बही में आपका स्वागत है।</h1>
              <p className="text-gray-700 text-base sm:text-lg mb-6 Hind-Bold">
                डिजिटल विगत बही — शादी-विवाह और सभी सामाजिक कार्यक्रमों के रिकॉर्ड को
                आधुनिक, सुरक्षित और सहज रूप में रखें। कभी भी, कहीं से भी जानकारी देखें।
              </p>

              {/* Buttons removed as requested */}
            </div>
          </div>

          {/* Features — improved layout with feature cards */}
          <section id="features" className="text-left text-gray-900 leading-relaxed max-w-4xl mx-auto mt-6">
            <h2 className="text-xl font-semibold mb-4"><span className="bg-red-700 px-5 py-2 rounded-lg text-white">विगत बही के बारे में –</span></h2>
            <p className="mb-4">
              विगत बही में आप अपने सभी सामाजिक कार्यक्रमों की एंट्री ऑनलाइन रख सकते
              हैं। अब किसी शादी या कार्यक्रम में जाने से पहले डायरी देखने की ज़रूरत
              नहीं। बस विगत बही खोलें, नाम सर्च करें और तुरंत पूरी जानकारी पाएं।
            </p>
            <p className="mb-4">
              यह नाम खोजने का सबसे आसान, तेज़ और स्मार्ट तरीका है।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="font-bold mb-2">🔎 नाम (Search)</h3>
                <p className="text-sm text-gray-700">नाम से तुरंत खोजें और पूरे कार्यक्रम का विवरण पाएं।</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="font-bold mb-2">📱 कहीं से भी पहुँच</h3>
                <p className="text-sm text-gray-700">मोबाइल और डेस्कटॉप पर सुरक्षित और सहज उपयोग।</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="font-bold mb-2">🔐 लॉक और सुरक्षा</h3>
                <p className="text-sm text-gray-700">एंट्री लॉक करें ताकि वही एंट्री दुबारा न डाली जा सके।</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="font-bold mb-2">🕒 समय की बचत</h3>
                <p className="text-sm text-gray-700">कागज़ी डायरी की जगह डिजिटल रिकॉर्ड से समय की बचत।</p>
              </div>
            </div>
          </section>

          {/* Testimonial */}
          <section className="max-w-4xl mx-auto mt-8">
            <div className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-lg shadow-sm">
              <blockquote className="text-gray-800 italic">“विगत बही ने हमारे काम को आसान किया है और यह एक बहुत अच्छी सुविधा है। इसका एक बार अवश्य प्रयोग करें।”</blockquote>
              <cite className="block mt-3 text-sm text-gray-600">— सुनील जी गोदारा, (आरणियाली)</cite>
            </div>
          </section>

          {/* Detailed features */}
          <section className="text-left text-gray-900 leading-relaxed max-w-3xl mx-auto mt-8">
            <h2 className="text-xl font-semibold mb-4"><span className="bg-red-700 px-5 py-2 rounded-lg text-white">विगत बही की सुविधाएँ –</span></h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>सभी सामाजिक कार्यक्रमों की डिजिटल एंट्री</li>
              <li>नाम से तुरंत खोज (Search) की सुविधा</li>
              <li>शादी, मुकलावा, मायरा, जन्मदिन एवं अन्य सभी सामाजिक कार्यक्रमों का पूरा रिकॉर्ड।</li>
              <li>काग़ज़ी डायरी से पूरी मुक्ति</li>
              <li>कहीं से भी, कभी भी जानकारी देखने की सुविधा</li>
              <li>सुरक्षित और व्यवस्थित डेटा</li>
              <li>समय की बचत और आसान उपयोग</li>
              <li>मोबाइल पर ही पूरा नियंत्रण</li>
            </ul>
          </section>

          <section className="text-left text-gray-900 leading-relaxed max-w-3xl mx-auto mt-8">
            <h2 className="text-xl font-semibold mb-4"><span className="bg-red-700 px-5 py-2 rounded-lg text-white">महत्वपूर्ण सुविधाएँ: –</span></h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>यदि आप किसी व्यक्ति की शादी में जाते हैं और आपने नेग/राशि दर्ज कर दी है, 
                तो उस एंट्री को लॉक कर सकते हैं, ताकि वही एंट्री दोबारा न डाली जा सके।</li>
              <li>आप अपनी सभी एंट्रियों को आवश्यकता अनुसार संशोधित (Edit) भी कर सकते हैं।</li>
              <li>यदि आप किसी की शादी में जाने वाले हैं और आप नेग की राशि भरते हो, तो उसका भी लेखा-जोखा रख सकते हो।</li>
            </ul>
          </section>

          <hr className="my-8" />

          <section className="text-sm text-gray-600 max-w-3xl mx-auto">
            <p>
              गोपनीयता, शर्तें और अन्य कानूनी पृष्ठों के लिए कृपया फूटर में दिए गए
              लिंक का उपयोग करें। निजी एप्लिकेशन सुविधाओं के लिए लॉगिन आवश्यक है और
              ये संरक्षित हैं।
            </p>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
