import React from 'react';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#06142E] text-gray-300 mt-auto">

      {/* Main Footer Content */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Column 1: Get in Touch */}
          <div>
            <h4 className="text-natpac-accent text-lg font-bold uppercase mb-6 pl-3 border-l-4 border-natpac-accent">
              Get in Touch
            </h4>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  K. Karunakaran Transpark,<br />
                  Akkulam, Thuruvikkal P.O,<br />
                  Thiruvananthapuram – 695 031<br />
                  Kerala, India
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-300 shrink-0" />
                <p>+91 471 2736900</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-300 shrink-0" />
                <a href="mailto:contact@natpac.kerala.gov.in" className="hover:text-natpac-accent transition-colors">
                  contact@natpac.kerala.gov.in
                </a>
              </div>
            </div>

            {/* Social Icons (SVG paths matching header) */}
            <div className="flex items-center gap-3 mt-8">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-natpac-accent transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-natpac-accent transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-natpac-accent transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-natpac-accent text-lg font-bold uppercase mb-6 pl-3 border-l-4 border-natpac-accent">
              Quick Links
            </h4>
            <ul className="text-sm text-gray-400 space-y-3 font-medium">
              <li><a href="#" className="hover:text-natpac-accent hover:pl-2 transition-all block">About NATPAC</a></li>
              <li><a href="#" className="hover:text-natpac-accent hover:pl-2 transition-all block">Data Repository</a></li>
              <li><a href="#" className="hover:text-natpac-accent hover:pl-2 transition-all block">Research Publications</a></li>
              <li><a href="#" className="hover:text-natpac-accent hover:pl-2 transition-all block">KSCSTE Website</a></li>
              <li><a href="#" className="hover:text-natpac-accent hover:pl-2 transition-all block">Kerala Government Portal</a></li>
              <li><a href="#" className="hover:text-natpac-accent hover:pl-2 transition-all block">Tenders & Notices</a></li>
            </ul>
          </div>

          {/* Column 3: Location Map */}
          <div>
            <h4 className="text-natpac-accent text-lg font-bold uppercase mb-6 pl-3 border-l-4 border-natpac-accent">
              Location
            </h4>
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/10 group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.7533036814234!2d76.90697967495408!3d8.52332619151978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05b95a8e578c7b%3A0xa97193952f4c330e!2sK.Karunakaran%20Transpark!5e0!3m2!1sen!2sin!4v1714567890123!5m2!1sen!2sin" 
                className="absolute inset-0 w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="NATPAC Location Map"
              ></iframe>
              
              {/* Overlay Open in Maps button */}
              <a 
                href="https://maps.app.goo.gl/example" 
                target="_blank" 
                rel="noreferrer"
                className="absolute top-3 left-3 bg-[#06142E]/90 text-white text-xs font-semibold px-4 py-2 rounded shadow-lg flex items-center gap-2 hover:bg-natpac-accent hover:text-natpac-primary transition-colors backdrop-blur-sm"
              >
                Open in Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="bg-[#051024] px-4 md:px-12 py-6 border-t border-white/5">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <div className="text-center md:text-left">
            <span>© 2026 National Transportation Planning and Research Centre. All Rights Reserved.</span>
          </div>
          <div className="text-center md:text-right flex items-center gap-4">
            <a href="#" className="hover:text-natpac-accent transition-colors">Privacy Policy</a>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <a href="#" className="hover:text-natpac-accent transition-colors">Terms of Use</a>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <span>Version 3.0</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
