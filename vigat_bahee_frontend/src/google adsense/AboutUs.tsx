import React from 'react';
import CustomVigatBaheeLogo from '../common/CustomVigatBaheeLogo';
import Footer from './Footer';

const AboutUs = () => {
  return (
    <>
      <CustomVigatBaheeLogo />

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Digital solutions for your special occasions - the perfect blend of tradition and modernity
            </p>
          </div>

          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 md:p-8 mb-8 text-white">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Welcome to VigatBahee.com</h2>
              <p className="text-lg leading-relaxed">
                In Indian traditions, maintaining a Vigat Bahee (gift registry) holds significant importance. 
                Our platform brings this centuries-old practice into the digital age. No more paper registers - 
                everything is just a click away!
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            
            {/* Our Story */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-blue-200 pb-2">
                Our Story
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  <strong>VigatBahee.com</strong> is a website designed to help every person manage their special occasions 
                  more effectively. Whether it's marriages, housewarming ceremonies, or any other auspicious events, 
                  people come with gifts and monetary contributions (Neg-Dheg). Traditionally, all these entries 
                  were recorded in paper-based registers.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  To become the common man's first choice, we have developed this comprehensive digital solution. 
                  Now you can easily store all guest details, the amount of gifts they brought, and other essential 
                  information securely in one place.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We have an experienced team that continuously provides you with the best features. We understand 
                  how many details need attention during Indian functions, which is why we've made this platform 
                  extremely user-friendly and intuitive.
                </p>
              </div>
            </section>

            {/* Our Mission */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-green-200 pb-2">
                Our Mission
              </h2>
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                  Our mission is to <strong>provide essential facilities</strong> that make every person's work easier. 
                  We aim to free people from the traditional method of making Vigat entries in books and help them save precious time.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-500 rounded-full p-1 mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">Time-saving solution</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-500 rounded-full p-1 mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">Digital record keeping</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-500 rounded-full p-1 mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">Easy accessibility</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-500 rounded-full p-1 mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">Secure data storage</span>
                  </div>
                </div>
              </div>
            </section>

            {/* What We Offer */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-purple-200 pb-2">
                What We Offer
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-semibold text-blue-800 mb-3">Digital Gift Registry</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Maintain comprehensive records of all gifts and monetary contributions received during 
                    special occasions with easy-to-use digital forms and automatic calculations.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-800 mb-3">Guest Management</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Keep track of all your guests, their contact information, relationship details, 
                    and contribution history for future reference and relationship management.
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-800 mb-3">Event Organization</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Organize multiple events separately, manage different types of functions, 
                    and maintain distinct records for each occasion with our intuitive interface.
                  </p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                  <h3 className="font-semibold text-orange-800 mb-3">Report Generation</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Generate detailed reports, summaries, and analytics of your events to help 
                    you understand patterns and plan better for future occasions.
                  </p>
                </div>
              </div>
            </section>

            {/* Our Values */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-red-200 pb-2">
                Our Values
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Reliability</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      We ensure that your data is always secure and accessible when you need it. 
                      Our platform is built with robust security measures and backup systems.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Efficiency</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      We believe in making your work faster and more efficient. Our tools are designed 
                      to save time and reduce the effort required in managing event records.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">User-Centric Design</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Every feature we build is designed with the end user in mind. We prioritize 
                      simplicity, ease of use, and intuitive interfaces for all age groups.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Why Choose Us */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-yellow-200 pb-2">
                Why Choose VigatBahee.com?
              </h2>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed mb-4">
                  This is an excellent facility for people that saves time and maintains accounts properly. 
                  We ensure that we provide you with the best service program available.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm">Time-saving digital solution replacing traditional paper records</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm">Proper account maintenance with automated calculations</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm">User-friendly interface designed for common people</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm">Continuous feature updates and reliable support</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-2">
                  <strong>Email:</strong> <a href="mailto:dudaram656@gmail.com" className="text-blue-600 hover:text-blue-800">dudaram656@gmail.com</a>
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Support:</strong> <a href="mailto:support@vigatbahee.com" className="text-blue-600 hover:text-blue-800">support@vigatbahee.com</a>
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Phone:</strong> +91-9587449072
                </p>
                <p className="text-gray-600">
                  <strong>Website:</strong> <a href="https://vigatbahee.com" className="text-blue-600 hover:text-blue-800">www.vigatbahee.com</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer/>
    </>
  );
};

export default AboutUs;