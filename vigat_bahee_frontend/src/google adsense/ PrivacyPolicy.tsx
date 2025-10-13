import CustomVigatBaheeLogo from '../common/CustomVigatBaheeLogo';
import Footer from './Footer';

const PrivacyPolicy = () => {
  return (
    <>
      <CustomVigatBaheeLogo />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">
              Effective Date: {new Date().toLocaleDateString()} | VigatBahee.com
            </p>
          </div>

          {/* Introduction Banner */}
          <div className="bg-blue-600 text-white rounded-lg p-6 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3">Your Privacy Matters to Us</h2>
              <p className="text-blue-100">
                At VigatBahee.com, we are committed to protecting your personal information and 
                maintaining transparency about how we collect, use, and safeguard your data.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            
            {/* Introduction */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">
                Introduction
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  This Privacy Policy describes how <strong>VigatBahee.com</strong> ("we," "our," or "us") 
                  collects, uses, protects, and shares your personal information when you use our digital 
                  gift registry platform and related services. This policy applies to all users of our website 
                  and mobile applications.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By accessing or using VigatBahee.com, you acknowledge that you have read, understood, and 
                  agree to be bound by this Privacy Policy and our Terms of Service. If you do not agree 
                  with any part of this policy, please do not use our services.
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm text-gray-700">
                    <strong>Important:</strong> This policy was last updated on {new Date().toLocaleDateString()}. 
                    We recommend reviewing this policy periodically for any changes.
                  </p>
                </div>
              </div>
            </section>

            {/* Information We Collect */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
                Information We Collect
              </h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Personal Information You Provide</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• <strong>Account Information:</strong> Name, email address, phone number, password</li>
                    <li>• <strong>Event Details:</strong> Function type, date, venue, host information</li>
                    <li>• <strong>Guest Information:</strong> Names, contact details, relationship details</li>
                    <li>• <strong>Gift Records:</strong> Monetary contributions, gift descriptions, amounts</li>
                    <li>• <strong>Communication Data:</strong> Messages, feedback, support requests</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Automatically Collected Information</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• <strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
                    <li>• <strong>Usage Data:</strong> Pages visited, time spent, click patterns, feature usage</li>
                    <li>• <strong>Location Data:</strong> IP address, approximate geographic location</li>
                    <li>• <strong>Technical Data:</strong> Log files, error reports, performance metrics</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-purple-500">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">Cookies and Tracking Technologies</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    We use various tracking technologies to enhance your experience:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>Essential Cookies:</strong> Required for core website functionality</li>
                    <li>• <strong>Analytics Cookies:</strong> Help us understand user behavior and improve services</li>
                    <li>• <strong>Advertising Cookies:</strong> Used for personalized ad delivery via Google Ads</li>
                    <li>• <strong>Social Media Cookies:</strong> Enable social sharing and integration features</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-orange-200 pb-2">
                How We Use Your Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Service Delivery</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Provide and maintain our digital gift registry platform</li>
                    <li>• Process and store your event and gift information</li>
                    <li>• Generate reports and analytics for your events</li>
                    <li>• Facilitate communication between event hosts and guests</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Platform Improvement</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Analyze usage patterns to enhance user experience</li>
                    <li>• Develop new features and improve existing ones</li>
                    <li>• Monitor and ensure platform security and reliability</li>
                    <li>• Provide technical support and customer service</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 bg-orange-50 p-4 rounded-lg">
                <h3 className="font-medium text-orange-800 mb-2">Communication & Marketing</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Send service updates, security alerts, and administrative messages</li>
                  <li>• Provide customer support and respond to inquiries</li>
                  <li>• Send promotional content and feature announcements (with consent)</li>
                  <li>• Conduct surveys and gather feedback to improve our services</li>
                </ul>
              </div>
            </section>

            {/* Google Ads & Third-Party Services */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-red-200 pb-2">
                Advertising & Third-Party Services
              </h2>
              
              <div className="space-y-6">
                <div className="bg-red-50 p-5 rounded-lg border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">Google Ads Integration</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    We partner with Google Ads to display relevant advertisements and improve our service reach:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Google may use cookies to serve personalized ads based on your website visits</li>
                    <li>• We use Google Analytics to understand user behavior and improve our platform</li>
                    <li>• Remarketing features help us show relevant ads to previous visitors</li>
                    <li>• You can opt out of personalized advertising through Google Ad Settings</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Your Advertising Choices</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    You have control over personalized advertising:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" 
                       className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors">
                      Google Ad Settings
                    </a>
                    <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" 
                       className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full hover:bg-green-200 transition-colors">
                      NAI Opt-out
                    </a>
                    <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" 
                       className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors">
                      Digital Advertising Alliance
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
                Data Sharing & Disclosure
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share 
                  your information only in the following limited circumstances:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Service Providers</h3>
                    <p className="text-xs text-gray-600">
                      Trusted partners who help us operate our platform (hosting, analytics, customer support)
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Legal Requirements</h3>
                    <p className="text-xs text-gray-600">
                      When required by law, court order, or to protect our rights and users' safety
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">Business Transfers</h3>
                    <p className="text-xs text-gray-600">
                      In case of merger, acquisition, or sale of assets (with proper notice to users)
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">With Your Consent</h3>
                    <p className="text-xs text-gray-600">
                      Any other sharing will only occur with your explicit permission
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
                Data Security & Protection
              </h2>
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500 mb-4">
                <h3 className="font-semibold text-green-800 mb-3">Our Security Measures</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <ul className="space-y-1">
                    <li>• SSL encryption for data transmission</li>
                    <li>• Secure database storage with encryption</li>
                    <li>• Regular security audits and updates</li>
                    <li>• Access controls and authentication</li>
                  </ul>
                  <ul className="space-y-1">
                    <li>• Regular backups and data recovery procedures</li>
                    <li>• Employee training on data protection</li>
                    <li>• Monitoring for unauthorized access attempts</li>
                    <li>• Compliance with industry security standards</li>
                  </ul>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
                <p className="text-sm text-gray-700">
                  <strong>Important Notice:</strong> While we implement industry-standard security measures, 
                  no method of transmission over the internet or electronic storage is 100% secure. We cannot 
                  guarantee absolute security, but we continuously work to protect your information.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">
                Your Privacy Rights
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  You have several rights regarding your personal information. To exercise any of these rights, 
                  please contact us at <a href="mailto:dudsoffice656@gmail.com" className="text-blue-600 hover:text-blue-800">dudsoffice656@gmail.com</a>:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Access & Portability</h3>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Request a copy of your personal data</li>
                      <li>• Download your event and guest information</li>
                      <li>• Receive data in a portable format</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Correction & Updates</h3>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Correct inaccurate personal information</li>
                      <li>• Update your profile and preferences</li>
                      <li>• Modify event and guest details</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-800 mb-2">Deletion & Restriction</h3>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Request deletion of your account</li>
                      <li>• Limit processing of your data</li>
                      <li>• Object to certain data uses</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">Consent Management</h3>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Withdraw consent at any time</li>
                      <li>• Opt out of marketing communications</li>
                      <li>• Manage cookie preferences</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-orange-200 pb-2">
                Data Retention Policy
              </h2>
              <div className="bg-orange-50 p-5 rounded-lg">
                <p className="text-gray-700 mb-3">
                  We retain your personal information only for as long as necessary to fulfill the purposes 
                  outlined in this Privacy Policy, unless a longer retention period is required by law.
                </p>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• <strong>Active Accounts:</strong> Data retained while your account remains active</p>
                  <p>• <strong>Inactive Accounts:</strong> Data may be deleted after 3 years of inactivity</p>
                  <p>• <strong>Legal Requirements:</strong> Some data may be retained longer for legal compliance</p>
                  <p>• <strong>Upon Request:</strong> Data deleted within 30 days of valid deletion requests</p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, 
                please don't hesitate to contact us:
              </p>
              <div className="bg-gray-50 p-5 rounded-lg border">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">General Inquiries</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Email:</strong> <a href="mailto:dudaram656@gmail.com" className="text-blue-600 hover:text-blue-800">dudaram656@gmail.com</a>
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Phone:</strong> +91-9587449072
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Privacy Officer</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Email:</strong> <a href="mailto:dudsoffice656@gmail.com" className="text-blue-600 hover:text-blue-800">dudsoffice656@gmail.com</a>
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Response Time:</strong> Within 48 hours
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Address:</strong> VigatBahee.com, Your Business Address, City, State, PIN Code, India
                  </p>
                </div>
              </div>
            </section>

            {/* Updates to Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
                Updates to This Privacy Policy
              </h2>
              <div className="bg-green-50 p-5 rounded-lg">
                <p className="text-gray-700 mb-3">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, 
                  technology, legal requirements, or other factors. We will notify you of any material changes by:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-3">
                  <li>• Posting the updated policy on our website with a new effective date</li>
                  <li>• Sending an email notification to registered users</li>
                  <li>• Displaying a prominent notice on our platform</li>
                  <li>• For significant changes, requesting your renewed consent</li>
                </ul>
                <p className="text-sm text-gray-600">
                  We encourage you to review this Privacy Policy periodically. Your continued use of our 
                  services after any changes indicates your acceptance of the updated policy.
                </p>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <p className="text-sm text-blue-800">
              <strong>Thank you for trusting VigatBahee.com with your special occasions.</strong><br/>
              Your privacy is important to us, and we're committed to keeping your information safe and secure.
            </p>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default PrivacyPolicy;