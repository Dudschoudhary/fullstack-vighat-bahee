import CustomVigatBaheeLogo from '../common/CustomVigatBaheeLogo';
import Footer from './Footer';

const TermsAndConditions = () => {
  return (
    <>
      <CustomVigatBaheeLogo />

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
            <p className="text-lg text-gray-600">
              Effective Date: {new Date().toLocaleDateString()} | VigatBahee.com
            </p>
          </div>

          {/* Introduction Banner */}
          <div className="bg-blue-600 text-white rounded-lg p-6 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3">Welcome to VigatBahee.com</h2>
              <p className="text-blue-100">
                Please read these Terms and Conditions carefully before using our digital gift registry platform. 
                Your use of our service constitutes acceptance of these terms.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            
            {/* Introduction */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">
                Agreement to Terms
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  These Terms and Conditions ("Terms") govern your access to and use of <strong>VigatBahee.com</strong> 
                  ("Platform," "Service," "we," "us," or "our"), a digital gift registry platform designed to help you 
                  manage and track gifts, monetary contributions, and guest information for your special occasions.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By accessing, browsing, registering for, or using our Platform in any manner, you acknowledge that 
                  you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do 
                  not agree with any part of these Terms, you must not use our Service.
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm text-gray-700">
                    <strong>Important:</strong> These Terms constitute a legally binding agreement between you and 
                    VigatBahee.com. Please ensure you understand all provisions before proceeding.
                  </p>
                </div>
              </div>
            </section>

            {/* Definitions */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
                Definitions
              </h2>
              <div className="grid md:grid-cols-1 gap-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <span className="font-semibold text-green-800 min-w-fit">"Platform/Service"</span>
                    <span className="text-gray-600">refers to the VigatBahee.com website, mobile applications, and all related digital services.</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="font-semibold text-green-800 min-w-fit">"User/You"</span>
                    <span className="text-gray-600">refers to any individual who accesses, registers for, or uses our Service.</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="font-semibold text-green-800 min-w-fit">"Host"</span>
                    <span className="text-gray-600">refers to a User who creates and manages a gift registry for their event.</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="font-semibold text-green-800 min-w-fit">"Guest"</span>
                    <span className="text-gray-600">refers to individuals whose information is recorded in a Host's gift registry.</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="font-semibold text-green-800 min-w-fit">"Event"</span>
                    <span className="text-gray-600">refers to any occasion (wedding, housewarming, etc.) for which a gift registry is created.</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="font-semibold text-green-800 min-w-fit">"Content"</span>
                    <span className="text-gray-600">includes all data, information, text, images, and other materials uploaded or entered into the Platform.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Eligibility and Registration */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
                Eligibility and Account Registration
              </h2>
              
              <div className="space-y-6">
                <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-purple-500">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">Eligibility Requirements</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• You must be at least 18 years old to create an account and use our Service</li>
                    <li>• You must provide accurate, current, and complete information during registration</li>
                    <li>• You must have the legal capacity to enter into binding agreements</li>
                    <li>• You must comply with all applicable laws and regulations in your jurisdiction</li>
                    <li>• Corporate entities must have proper authorization to accept these Terms</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Account Responsibilities</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Maintain the confidentiality of your account credentials</li>
                    <li>• You are responsible for all activities that occur under your account</li>
                    <li>• Immediately notify us of any unauthorized use or security breach</li>
                    <li>• Keep your account information updated and accurate</li>
                    <li>• You may only maintain one active account per person</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Service Description */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-orange-200 pb-2">
                Service Description and Features
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  VigatBahee.com provides a digital platform for managing gift registries and tracking contributions 
                  for special occasions, particularly focusing on Indian ceremonies and celebrations.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-orange-800 mb-3">Core Features</h3>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Digital gift registry creation and management</li>
                      <li>• Guest information tracking and storage</li>
                      <li>• Monetary contribution recording (Neg-Dheg)</li>
                      <li>• Event management tools and analytics</li>
                      <li>• Report generation and data export</li>
                      <li>• Multi-event support for different occasions</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-3">Additional Services</h3>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Data backup and security measures</li>
                      <li>• Customer support and assistance</li>
                      <li>• Regular feature updates and improvements</li>
                      <li>• Mobile-responsive platform access</li>
                      <li>• Privacy controls and data management</li>
                      <li>• Integration with popular communication tools</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm text-gray-700">
                    <strong>Service Availability:</strong> While we strive to provide uninterrupted service, we do not 
                    guarantee 100% uptime. Scheduled maintenance and unforeseen technical issues may occasionally affect availability.
                  </p>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-red-200 pb-2">
                User Responsibilities and Prohibited Uses
              </h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">Your Responsibilities</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Ensure accuracy of all information you enter into the Platform</li>
                    <li>• Obtain necessary consents before recording guest information</li>
                    <li>• Respect the privacy and confidentiality of guest data</li>
                    <li>• Use the Service only for legitimate gift registry purposes</li>
                    <li>• Comply with all applicable data protection laws</li>
                    <li>• Report any technical issues or security concerns promptly</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-5 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-3">Prohibited Activities</h3>
                  <p className="text-sm text-gray-700 mb-3">You agree not to use our Service for any of the following:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Any unlawful purpose or in violation of applicable laws</li>
                    <li>• Harassment, abuse, or discrimination against any individual</li>
                    <li>• Recording false, misleading, or fabricated information</li>
                    <li>• Attempting to gain unauthorized access to our systems</li>
                    <li>• Interfering with or disrupting the Service's functionality</li>
                    <li>• Using automated tools to scrape or extract data</li>
                    <li>• Sharing your account credentials with unauthorized persons</li>
                    <li>• Commercial use without proper licensing agreement</li>
                    <li>• Uploading malicious code, viruses, or harmful content</li>
                    <li>• Violating intellectual property rights of others</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data and Privacy */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">
                Data Handling and Privacy
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy for detailed information about 
                  how we collect, use, and protect your personal information.
                </p>

                <div className="grid md:grid-cols-1 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <h3 className="font-semibold text-blue-800 mb-3">Data Ownership and Rights</h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• You retain ownership of all data you enter into our Platform</li>
                      <li>• We act as a data processor for the guest information you manage</li>
                      <li>• You are responsible for obtaining necessary consents for guest data</li>
                      <li>• You have the right to export, modify, or delete your data</li>
                      <li>• We implement appropriate security measures to protect your information</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Data Retention:</strong> We retain your data for as long as your account is active or as 
                    needed to provide services. You may request data deletion, subject to legal and business requirements.
                  </p>
                </div>
              </div>
            </section>

            {/* Payment and Financial Terms */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
                Payment Terms and Financial Information
              </h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">Service Fees</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Currently, VigatBahee.com offers free access to our basic service. If we introduce paid features 
                    or premium services in the future:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• We will provide 30 days advance notice of any pricing changes</li>
                    <li>• Existing users will have the option to continue with free features</li>
                    <li>• Premium features will be clearly identified and priced transparently</li>
                    <li>• All payments will be processed through secure, third-party payment gateways</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-800 mb-2">Gift and Monetary Tracking</h3>
                  <p className="text-sm text-gray-700">
                    Our Platform helps you track monetary contributions and gifts received. We do not process, handle, 
                    or have access to actual payments or monetary transactions between you and your guests. All financial 
                    exchanges occur outside our Platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
                Intellectual Property Rights
              </h2>
              
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-800 mb-3">Our Rights</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• VigatBahee.com and all its features are protected by copyright and trademark laws</li>
                    <li>• The Platform's design, functionality, and proprietary algorithms are our intellectual property</li>
                    <li>• You may not copy, modify, distribute, or reverse engineer any part of our Service</li>
                    <li>• Our brand name, logo, and related marks are registered trademarks</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-semibold text-blue-800 mb-3">Your Content Rights</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• You retain ownership of all content and data you upload to our Platform</li>
                    <li>• You grant us a limited license to use your content for service provision</li>
                    <li>• We will not use your personal data for marketing without explicit consent</li>
                    <li>• You are responsible for ensuring you have rights to all content you upload</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Advertising and Third-Party Services */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-orange-200 pb-2">
                Advertising and Third-Party Services
              </h2>
              
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-800 mb-3">Google Ads Integration</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    We may display advertisements through Google Ads and other advertising networks to support our free service:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Ads are clearly marked and separate from our core functionality</li>
                    <li>• We do not endorse or guarantee the quality of advertised products/services</li>
                    <li>• Third-party advertisers may use cookies for personalized advertising</li>
                    <li>• You can opt out of personalized ads through your browser or ad settings</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Disclaimer:</strong> We are not responsible for the content, accuracy, or practices of 
                    third-party advertisers or their websites. Any interactions with advertisers are solely between 
                    you and the advertiser.
                  </p>
                </div>
              </div>
            </section>

            {/* Service Availability */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-red-200 pb-2">
                Service Availability and Modifications
              </h2>
              
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-3">Service Modifications</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• We reserve the right to modify, suspend, or discontinue any part of our Service</li>
                    <li>• We will provide reasonable notice for significant changes affecting functionality</li>
                    <li>• Emergency maintenance may occur without advance notice</li>
                    <li>• We may introduce new features or remove existing ones to improve user experience</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">Account Termination</h3>
                  <p className="text-sm text-gray-700">
                    We may suspend or terminate your account for violations of these Terms, illegal activities, 
                    or extended inactivity. You may terminate your account at any time by contacting our support team.
                  </p>
                </div>
              </div>
            </section>

            {/* Disclaimers */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-yellow-200 pb-2">
                Disclaimers and Limitation of Liability
              </h2>
              
              <div className="space-y-6">
                <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-800 mb-3">Service Disclaimer</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Our Service is provided "as is" and "as available" without any warranties of any kind:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• We do not guarantee uninterrupted or error-free service</li>
                    <li>• We are not responsible for data loss due to technical failures</li>
                    <li>• The accuracy of user-entered information is not guaranteed by us</li>
                    <li>• Third-party integrations may affect service functionality</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-3">Limitation of Liability</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    To the maximum extent permitted by law, VigatBahee.com shall not be liable for:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Indirect, incidental, special, or consequential damages</li>
                    <li>• Loss of profits, data, or business opportunities</li>
                    <li>• Damages resulting from your use or inability to use our Service</li>
                    <li>• Actions or omissions of third parties, including advertisers</li>
                    <li>• Unauthorized access to your account due to your negligence</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Maximum Liability:</strong> In any case, our total liability to you shall not exceed 
                    the amount you have paid us (if any) for the Service in the twelve months preceding the claim.
                  </p>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
                Governing Law and Dispute Resolution
              </h2>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-800 mb-3">Applicable Law</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• These Terms are governed by the laws of India</li>
                    <li>• The Indian Contract Act, 1872 and Information Technology Act, 2000 shall apply</li>
                    <li>• Consumer Protection Act, 2019 provisions shall apply where applicable</li>
                    <li>• Courts in New Delhi, India shall have exclusive jurisdiction</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">Dispute Resolution Process</h3>
                  <ol className="text-sm text-gray-700 space-y-1">
                    <li>1. <strong>Direct Resolution:</strong> Contact our support team first for issue resolution</li>
                    <li>2. <strong>Mediation:</strong> Attempt good-faith mediation before legal proceedings</li>
                    <li>3. <strong>Arbitration:</strong> Binding arbitration under Indian Arbitration Act, if applicable</li>
                    <li>4. <strong>Court Proceedings:</strong> Legal action only after exhausting above options</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
                Modifications to These Terms
              </h2>
              
              <div className="bg-purple-50 p-5 rounded-lg">
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify these Terms at our discretion. When we make changes:
                </p>
                <ul className="text-sm text-gray-700 space-y-2 mb-4">
                  <li>• We will update the "Effective Date" at the top of this page</li>
                  <li>• For material changes, we will provide 30 days advance notice via email</li>
                  <li>• We will display a prominent notice on our Platform</li>
                  <li>• Continued use after changes constitutes acceptance of new Terms</li>
                  <li>• If you disagree with changes, you may terminate your account</li>
                </ul>
                <p className="text-sm text-gray-600">
                  We encourage you to review these Terms periodically. The most current version will always be available on our website.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                Contact Information and Support
              </h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions, concerns, or need assistance regarding these Terms and Conditions or our Service, 
                please don't hesitate to contact us:
              </p>
              
              <div className="bg-gray-50 p-5 rounded-lg border">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">General Support</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Email:</strong> <a href="mailto:dudaram656@gmail.com" className="text-blue-600 hover:text-blue-800">dudaram656@gmail.com</a>
                      </p>
                      <p>
                        <strong>Phone:</strong> <a href="tel:+919587449072" className="text-blue-600 hover:text-blue-800">+91-9587449072</a>
                      </p>
                      <p>
                        <strong>Response Time:</strong> Within 24-48 hours
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Legal and Compliance</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Legal Email:</strong> <a href="mailto:dudsoffice656@gmail.com" className="text-blue-600 hover:text-blue-800">dudsoffice656@gmail.com</a>
                      </p>
                      <p>
                        <strong>Privacy Officer:</strong> <a href="mailto:privacy@vigatbahee.com" className="text-blue-600 hover:text-blue-800">privacy@vigatbahee.com</a>
                      </p>
                      <p>
                        <strong>Business Hours:</strong> Mon-Fri, 9 AM - 6 PM IST
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Registered Address:</strong> VigatBahee.com, Baldev Nagar,
                    Jodhpur, Rajasthan - 342003, India
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Acceptance Notice */}
          <div className="mt-8 p-5 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <h3 className="font-semibold text-blue-800 mb-2">Acknowledgment</h3>
              <p className="text-sm text-blue-700">
                By using VigatBahee.com, you acknowledge that you have read, understood, and agree to be bound by these 
                Terms and Conditions. Thank you for choosing our platform for your special occasions!
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer/>
    </>
  );
};

export default TermsAndConditions;