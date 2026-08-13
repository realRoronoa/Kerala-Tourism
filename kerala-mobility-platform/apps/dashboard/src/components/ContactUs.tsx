import React from 'react';

const ContactUs: React.FC = () => {
  return (
    <div className="bg-white border border-gray-300 shadow-sm p-8 md:p-12 mb-8">
      <h2 className="text-3xl font-semibold text-gov-blue-primary uppercase tracking-wide mb-8 border-b-4 border-accent-orange pb-4">
        Contact Us
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Head Office */}
        <div>
          <h3 className="text-xl font-semibold text-gov-blue-secondary mb-4 uppercase tracking-wide border-b border-gray-200 pb-2">
            Head Office
          </h3>
          <div className="text-gray-800 leading-relaxed text-lg space-y-4">
            <p className="font-semibold">National Transportation Planning and Research Centre (NATPAC)</p>
            <p>
              K. Karunakaran Transpark,<br />
              Akkulam, Thuruvikkal P.O,<br />
              Thiruvananthapuram - 695 031<br />
              Kerala, India.
            </p>
            <div>
              <p><span className="font-semibold">Phone:</span> +91 471 2736900</p>
              <p><span className="font-semibold">Fax:</span> +91 471 2736905</p>
              <p><span className="font-semibold">Email:</span> contact@natpac.kerala.gov.in</p>
            </div>
          </div>
        </div>

        {/* Regional Offices */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-gov-blue-secondary mb-4 uppercase tracking-wide border-b border-gray-200 pb-2">
              Regional Office (Central)
            </h3>
            <div className="text-gray-800 leading-relaxed">
              <p>
                Jawaharlal Nehru International Stadium,<br />
                Kaloor, Ernakulam - 682 017
              </p>
              <p className="mt-2"><span className="font-semibold">Phone:</span> +91 484 2345678</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gov-blue-secondary mb-4 uppercase tracking-wide border-b border-gray-200 pb-2">
              Regional Office (North)
            </h3>
            <div className="text-gray-800 leading-relaxed">
              <p>
                CWRDM Campus, Kunnamangalam,<br />
                Kozhikode - 673 571
              </p>
              <p className="mt-2"><span className="font-semibold">Phone:</span> +91 495 2456789</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
