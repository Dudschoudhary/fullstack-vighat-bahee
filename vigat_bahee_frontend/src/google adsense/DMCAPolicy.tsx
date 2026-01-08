import CustomVigatBaheeLogo from '../common/CustomVigatBaheeLogo';
import Footer from './Footer';

const DMCAPolicy = () => {
  return (
    <>
      <CustomVigatBaheeLogo />
      
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">DMCA Policy</h1>
            <p className="text-lg text-gray-600">
              Digital Millennium Copyright Act Compliance | Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Introduction Banner */}
          <div className="bg-blue-600 text-white rounded-lg p-6 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3">Copyright Protection Notice</h2>
              <p className="text-blue-100">
                vigatbahi.me respects intellectual property rights and responds promptly to valid copyright 
                infringement notices in accordance with the Digital Millennium Copyright Act (DMCA).
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            
            {/* Policy Overview */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">
                Policy Overview
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  vigatbahi.me ("we," "us," or "our") is committed to respecting the intellectual property rights 
                  of others. While our platform primarily serves as a digital gift registry for personal events, 
                  we recognize that users may upload various forms of content, and we take copyright protection seriously.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  This DMCA Policy outlines our procedures for responding to copyright infringement claims and 
                  protecting the rights of copyright holders while maintaining fair use for our users.
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm text-gray-700">
                    <strong>Important:</strong> This policy applies to all content uploaded, shared, or displayed 
                    on our platform, including but not limited to images, text, and multimedia content.
                  </p>
                </div>
              </div>
            </section>

            {/* What Constitutes Copyright Infringement */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-red-200 pb-2">
                What Constitutes Copyright Infringement
              </h2>
              
              <div className="space-y-6">
                <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">Examples of Potential Infringement</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Uploading copyrighted images without permission from the copyright holder</li>
                    <li>• Using proprietary graphics, logos, or designs owned by others</li>
                    <li>• Sharing copyrighted text, articles, or written content without authorization</li>
                    <li>• Displaying copyrighted multimedia content (videos, audio files)</li>
                    <li>• Using copyrighted templates, designs, or layouts without proper licensing</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">What is NOT Copyright Infringement</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Personal photos and images taken by the user</li>
                    <li>• Content created originally by the user</li>
                    <li>• Public domain materials and government publications</li>
                    <li>• Content used under valid fair use provisions</li>
                    <li>• Content used with explicit permission from the copyright holder</li>
                    <li>• Creative Commons licensed materials (when used according to license terms)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Filing a DMCA Takedown Notice */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-orange-200 pb-2">
                Filing a DMCA Takedown Notice
              </h2>
              
              <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed">
                  If you believe that your copyrighted work has been used on our platform without authorization, 
                  you may submit a DMCA takedown notice. Your notice must include all required elements to be considered valid.
                </p>

                <div className="bg-orange-50 p-5 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-800 mb-4">Required Elements for Valid DMCA Notice</h3>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-orange-400 pl-4">
                      <h4 className="font-semibold text-gray-800 mb-2">1. Identification of Copyrighted Work</h4>
                      <p className="text-sm text-gray-600">
                        Clearly identify the copyrighted work that you claim has been infringed. If multiple works 
                        are involved, provide a representative list.
                      </p>
                    </div>

                    <div className="border-l-4 border-orange-400 pl-4">
                      <h4 className="font-semibold text-gray-800 mb-2">2. Identification of Infringing Material</h4>
                      <p className="text-sm text-gray-600">
                        Provide the specific URL(s) or location(s) of the infringing material on our platform. 
                        Be as specific as possible to help us locate the content.
                      </p>
                    </div>

                    <div className="border-l-4 border-orange-400 pl-4">
                      <h4 className="font-semibold text-gray-800 mb-2">3. Contact Information</h4>
                      <p className="text-sm text-gray-600">
                        Include your full name, mailing address, telephone number, and email address.
                      </p>
                    </div>

                    <div className="border-l-4 border-orange-400 pl-4">
                      <h4 className="font-semibold text-gray-800 mb-2">4. Good Faith Statement</h4>
                      <p className="text-sm text-gray-600">
                        A statement that you have a good faith belief that use of the material is not authorized 
                        by the copyright owner, its agent, or the law.
                      </p>
                    </div>

                    <div className="border-l-4 border-orange-400 pl-4">
                      <h4 className="font-semibold text-gray-800 mb-2">5. Accuracy Statement</h4>
                      <p className="text-sm text-gray-600">
                        A statement, under penalty of perjury, that the information in your notice is accurate and 
                        that you are the copyright owner or authorized to act on behalf of the copyright owner.
                      </p>
                    </div>

                    <div className="border-l-4 border-orange-400 pl-4">
                      <h4 className="font-semibold text-gray-800 mb-2">6. Physical or Electronic Signature</h4>
                      <p className="text-sm text-gray-600">
                        Your physical or electronic signature.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">How to Submit Your DMCA Notice</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Send your complete DMCA takedown notice to our designated agent:
                  </p>
                  <div className="bg-white p-3 rounded border text-sm">
                    <p><strong>DMCA Agent for vigatbahi.me</strong></p>
                    <p><strong>Email:</strong> vigatbahi@gmail.com</p>
                    <p><strong>Phone:</strong> +91-958749072</p>
                    <p><strong>Address:</strong>vigatbahi.me, Baldev Nagar, Jodhpur, Rajasthan - 342003, India</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Our Response to DMCA Notices */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
                Our Response Process
              </h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">Upon Receiving a Valid DMCA Notice</h3>
                  <ol className="text-sm text-gray-700 space-y-2">
                    <li><strong>1. Review and Verification (24-48 hours):</strong> We will review your notice to ensure it meets all DMCA requirements.</li>
                    <li><strong>2. Content Removal:</strong> If valid, we will expeditiously remove or disable access to the allegedly infringing material.</li>
                    <li><strong>3. User Notification:</strong> We will notify the user who uploaded the content about the removal and the reason.</li>
                    <li><strong>4. Documentation:</strong> We maintain records of all DMCA notices and actions taken.</li>
                    <li><strong>5. Confirmation:</strong> We will send you a confirmation once the content has been removed.</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <h3 className="font-semibold text-yellow-800 mb-2">Processing Timeline</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>Initial Response:</strong> Within 24 hours of receiving notice</li>
                    <li>• <strong>Content Removal:</strong> Within 72 hours for valid notices</li>
                    <li>• <strong>User Notification:</strong> Immediately upon content removal</li>
                    <li>• <strong>Final Confirmation:</strong> Within 24 hours of action completion</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Counter-Notice Process */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
                Counter-Notice Process for Users
              </h2>
              
              <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed">
                  If you believe your content was removed in error or as a result of misidentification, you may 
                  file a counter-notice to request restoration of the content.
                </p>

                <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-purple-500">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">Counter-Notice Requirements</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Your physical or electronic signature</li>
                    <li>• Identification of the material that was removed and its location before removal</li>
                    <li>• A statement under penalty of perjury that you have a good faith belief the material was removed by mistake or misidentification</li>
                    <li>• Your name, address, and telephone number</li>
                    <li>• A statement consenting to jurisdiction of Federal District Court</li>
                    <li>• A statement that you will accept service of process from the person who filed the original DMCA notice</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Counter-Notice Process</h3>
                  <ol className="text-sm text-gray-700 space-y-1">
                    <li>1. Submit complete counter-notice to: <strong>vigatbahi@gmail.com</strong></li>
                    <li>2. We forward your counter-notice to the original complainant</li>
                    <li>3. We wait 10-14 business days for any legal action</li>
                    <li>4. If no legal action is taken, we may restore the content</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Repeat Infringer Policy */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-red-200 pb-2">
                Repeat Infringer Policy
              </h2>
              
              <div className="bg-red-50 p-5 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-800 mb-3">Account Termination for Repeat Offenders</h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">
                    vigatbahi.me has adopted a policy of terminating accounts of users who are repeat copyright infringers:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• <strong>First Offense:</strong> Warning and content removal</li>
                    <li>• <strong>Second Offense:</strong> Temporary account suspension (7-30 days)</li>
                    <li>• <strong>Third Offense:</strong> Permanent account termination</li>
                    <li>• <strong>Severe Cases:</strong> Immediate termination for flagrant violations</li>
                  </ul>
                  <p className="text-sm text-gray-700 mt-4">
                    Users whose accounts are terminated for repeat infringement will not be permitted to create new accounts 
                    on our platform.
                  </p>
                </div>
              </div>
            </section>

            {/* False Claims Warning */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-yellow-200 pb-2">
                Warning Against False Claims
              </h2>
              
              <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-3">Consequences of False DMCA Claims</h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    Filing false or fraudulent DMCA notices is a serious matter with legal consequences:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• <strong>Perjury Charges:</strong> False statements under penalty of perjury may result in criminal charges</li>
                    <li>• <strong>Civil Liability:</strong> You may be liable for damages including attorney fees</li>
                    <li>• <strong>Platform Consequences:</strong> We may block future notices from repeat false claimants</li>
                    <li>• <strong>Legal Action:</strong> Affected users may pursue legal remedies against false claimants</li>
                  </ul>
                  <div className="bg-red-100 p-3 rounded mt-4">
                    <p className="text-xs text-red-800">
                      <strong>Important:</strong> Only file DMCA notices if you have a good faith belief that the use 
                      constitutes copyright infringement and you are the copyright owner or authorized to act on their behalf.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* International Considerations */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">
                International and Indian Copyright Law
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  While DMCA is US law, vigatbahi.me respects copyright laws globally and operates under Indian copyright 
                  law as well. Our platform serves users internationally, and we aim to comply with applicable copyright 
                  laws in all jurisdictions where we operate.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <h3 className="font-semibold text-blue-800 mb-2">Indian Copyright Act, 1957</h3>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• We comply with Indian copyright law provisions</li>
                      <li>• Section 52 fair dealing exceptions apply</li>
                      <li>• Educational and research use considerations</li>
                      <li>• Indian court jurisdiction for Indian users</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <h3 className="font-semibold text-green-800 mb-2">International Treaties</h3>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Berne Convention compliance</li>
                      <li>• WIPO Copyright Treaty recognition</li>
                      <li>• Cross-border enforcement cooperation</li>
                      <li>• Mutual legal assistance provisions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                DMCA Contact Information
              </h2>
              
              <div className="bg-gray-50 p-5 rounded-lg border">
                <h3 className="font-semibold text-gray-800 mb-4">Designated DMCA Agent</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Copyright Infringement Reports</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Email:</strong> <a href="mailto:vigatbahi@gmail.com" className="text-blue-600 hover:text-blue-800">vigatbahi@gmail.com</a></p>
                      <p><strong>Subject Line:</strong> "DMCA Takedown Notice - [Your Company/Name]"</p>
                      <p><strong>Response Time:</strong> 24-48 hours</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Legal Department</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Email:</strong> <a href="mailto:vigatbahi@gmail.com" className="text-blue-600 hover:text-blue-800">vigatbahi@gmail.com</a></p>
                      <p><strong>Phone:</strong> +91-9468650730</p>
                      <p><strong>Hours:</strong> Mon-Fri, 9 AM - 6 PM IST</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">Mailing Address</h4>
                  <p className="text-sm text-gray-600">
                    <strong>DMCA Agent</strong><br/>
                    vigatbahi.me<br/>
                    Baldev Nagar<br/>
                    Jodhpur, Rajasthan - 342003<br/>
                    India
                  </p>
                </div>
              </div>
            </section>

            {/* Policy Updates */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
                Policy Updates and Modifications
              </h2>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-3">
                  We reserve the right to modify this DMCA Policy at any time to reflect changes in law, 
                  our practices, or platform features. When we make significant changes:
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• We will update the "Last updated" date at the top of this policy</li>
                  <li>• Users will be notified of material changes via email or platform notice</li>
                  <li>• The most current version will always be available on our website</li>
                  <li>• Continued use of our platform constitutes acceptance of policy updates</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-200 text-center">
            <p className="text-sm text-red-800">
              <strong>Disclaimer:</strong> This DMCA Policy is for informational purposes and does not constitute legal advice. 
              For specific legal questions, please consult with a qualified attorney familiar with copyright law.
            </p>
          </div>
        </div>
      </div>
      
      <Footer/>
    </>
  );
};

export default DMCAPolicy;