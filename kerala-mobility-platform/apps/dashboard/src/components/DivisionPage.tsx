import React from 'react';
import { HardHat, Car, Ship, FileText, CheckCircle, MapPin } from 'lucide-react';

interface DivisionPageProps {
  division: string;
}

const DivisionPage: React.FC<DivisionPageProps> = ({ division }) => {
  let title = '';
  let description = '';
  let Icon = HardHat;

  if (division === 'division-highway') {
    title = 'Highway Engineering';
    description = 'Research and development in the fields of pavement engineering, highway materials, geometric design, and structural analysis of transport infrastructure.';
    Icon = HardHat;
  } else if (division === 'division-traffic') {
    title = 'Traffic Safety & Management';
    description = 'Comprehensive studies on traffic flow, road safety audits, accident analysis, and intelligent transportation systems (ITS) for smart cities.';
    Icon = CheckCircle;
  } else if (division === 'division-public') {
    title = 'Public Transport';
    description = 'Optimization of bus transit networks, multi-modal integration, fare policy evaluation, and sustainable mobility planning for urban environments.';
    Icon = Car;
  } else if (division === 'division-planning') {
    title = 'Transport Planning';
    description = 'Strategic long-term transportation planning, travel demand modeling, economic feasibility studies, and environmental impact assessments.';
    Icon = MapPin;
  } else if (division === 'division-water') {
    title = 'Water Transport';
    description = 'Planning and execution of inland water transport systems, coastal shipping infrastructure, and sustainable maritime logistics networks.';
    Icon = Ship;
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto py-8 px-4 md:px-12 min-h-[60vh]">
      <div className="bg-white shadow-sm border border-gray-200">
        {/* Header Header - More formal and smaller */}
        <div className="bg-natpac-primary px-8 py-6 text-white flex items-center gap-4 border-b-4 border-natpac-accent">
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 text-natpac-accent" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wide mb-1">{title}</h1>
            <p className="text-gray-300 text-sm max-w-3xl leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-lg font-bold text-natpac-primary mb-4 border-b border-gray-200 pb-2 uppercase tracking-wide">
            Recent Projects & Milestones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex gap-3 p-4 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
                <CheckCircle className="w-5 h-5 text-natpac-royal shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-gray-900 mb-1">Project Identifier #{1000 + item * 24}</h3>
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
                  <button className="text-natpac-royal text-xs font-bold uppercase tracking-wide flex items-center gap-1 hover:text-natpac-accent transition-colors">
                    <FileText className="w-3 h-3" /> Download Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DivisionPage;
