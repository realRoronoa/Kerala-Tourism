import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer id="contact-us" className="bg-gov-blue-footer text-gray-300 mt-12">

      {/* Top orange accent line */}
      <div className="h-1 bg-accent-orange w-full" />

      {/* Main Footer Content */}
      <div className="max-w-screen-2xl mx-auto px-8 md:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Column 1: About */}
          <div className="md:col-span-1">
            <h4 className="text-white text-sm font-semibold uppercase mb-4 pb-2 border-b border-gray-600">
              About NATPAC
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              National Transportation Planning and Research Centre (NATPAC) is an institution under Kerala State Council for Science, Technology and Environment (KSCSTE), Government of Kerala.
            </p>
          </div>

          {/* Column 2: Head Office */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase mb-4 pb-2 border-b border-gray-600">
              Head Office
            </h4>
            <address className="text-xs text-gray-400 not-italic leading-6 space-y-1">
              <p>K. Karunakaran Transpark,</p>
              <p>Akkulam, Thuruvikkal P.O,</p>
              <p>Thiruvananthapuram – 695 031</p>
              <p>Kerala, India</p>
              <p className="pt-2">
                <span className="text-gray-300">Phone:</span> +91 471 2736900
              </p>
              <p>
                <span className="text-gray-300">Fax:</span> +91 471 2736905
              </p>
              <p>
                <span className="text-gray-300">Email:</span>{' '}
                <a href="mailto:contact@natpac.kerala.gov.in" className="text-orange-400 hover:underline">
                  contact@natpac.kerala.gov.in
                </a>
              </p>
            </address>
          </div>

          {/* Column 3: Regional Offices */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase mb-4 pb-2 border-b border-gray-600">
              Regional Offices
            </h4>
            <div className="text-xs text-gray-400 leading-6 space-y-3">
              <div>
                <p className="text-gray-300">Central Office (Ernakulam)</p>
                <p>Jawaharlal Nehru Stadium,</p>
                <p>Kaloor, Ernakulam – 682 017</p>
                <p><span className="text-gray-300">Ph:</span> +91 484 2345678</p>
              </div>
              <div className="pt-1">
                <p className="text-gray-300">Northern Office (Kozhikode)</p>
                <p>CWRDM Campus, Kunnamangalam,</p>
                <p>Kozhikode – 673 571</p>
                <p><span className="text-gray-300">Ph:</span> +91 495 2456789</p>
              </div>
            </div>
          </div>

          {/* Column 4: Quick Links & Hours */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase mb-4 pb-2 border-b border-gray-600">
              Quick Links
            </h4>
            <ul className="text-xs text-gray-400 space-y-2 leading-6 mb-6">
              <li><a href="#" className="hover:text-orange-400 transition-colors">About NATPAC</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Data Repository</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Research Publications</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">KSCSTE Website</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Kerala Government Portal</a></li>
            </ul>
            <h4 className="text-white text-xs font-semibold uppercase mb-2">Office Hours</h4>
            <p className="text-xs text-gray-400 leading-5">Mon – Sat: 10:00 AM – 5:00 PM</p>
            <p className="text-xs text-gray-400">Closed on Sundays & Govt. Holidays</p>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700/60" />

      {/* Bottom Bar */}
      <div className="max-w-screen-2xl mx-auto px-8 md:px-12 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
            <span>© 2026 NATPAC. All Rights Reserved.</span>
            <span className="hidden md:inline text-gray-700">|</span>
            <span>Visitors Today: <span className="text-gray-400">1,245</span></span>
            <span className="hidden md:inline text-gray-700">|</span>
            <span>Total Visitors: <span className="text-gray-400">4,52,190</span></span>
          </div>
          <div className="text-center md:text-right text-gray-600">
            <span>Last Updated: 13-Aug-2026 &nbsp;|&nbsp; Version 2.1.0</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
