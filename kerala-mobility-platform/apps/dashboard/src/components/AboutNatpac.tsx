import React, { useState } from 'react';
import { Clock, ArrowRight, Activity, MapPin, ChevronRight, ShieldCheck, Bus, HardHat, X } from 'lucide-react';

interface AboutNatpacProps {
  onTabChange?: (tab: string) => void;
}

const AboutNatpac: React.FC<AboutNatpacProps> = ({ onTabChange }) => {
  const [selectedInsight, setSelectedInsight] = useState<number | null>(null);
  const [selectedInitiative, setSelectedInitiative] = useState<string | null>(null);

  const insightsData = [
    {
      id: 1,
      title: 'Comprehensive Traffic Safety Study Released',
      date: 'August 11, 2026',
      image: 'https://images.unsplash.com/photo-1593950315186-76a92975b60c?q=80&w=600&auto=format&fit=crop&sig=1',
      summary: 'In line with our mandate to improve statewide mobility, the new research paper outlines critical interventions required to minimize congestion and improve pedestrian safety.',
      content: 'In line with our mandate to improve statewide mobility, the new research paper outlines critical interventions required to minimize congestion and improve pedestrian safety. The study comprehensively analyzed 50 major intersections across the state and identified key black spots. Proposed solutions include AI-driven traffic light coordination, dedicated pedestrian refuge islands, and improved signage. Implementation is expected to reduce pedestrian-related accidents by 30% over the next two years.'
    },
    {
      id: 2,
      title: 'New Public Transit Framework Proposed',
      date: 'August 12, 2026',
      image: 'https://images.unsplash.com/photo-1593950315186-76a92975b60c?q=80&w=600&auto=format&fit=crop&sig=2',
      summary: 'A massive overhaul of the public transit framework has been proposed to integrate bus, rail, and ferry networks into a single, seamless passenger experience.',
      content: 'A massive overhaul of the public transit framework has been proposed to integrate bus, rail, and ferry networks into a single, seamless passenger experience. This initiative focuses on unified ticketing, synchronized schedules, and building multi-modal hubs at key junctions. Initial pilot projects will begin in the Ernakulam district next year. The framework aims to increase public transport ridership by 15% and reduce greenhouse gas emissions.'
    },
    {
      id: 3,
      title: 'Highway Infrastructure Audit 2026',
      date: 'August 13, 2026',
      image: 'https://images.unsplash.com/photo-1593950315186-76a92975b60c?q=80&w=600&auto=format&fit=crop&sig=3',
      summary: 'The 2026 Highway Infrastructure Audit has concluded that routine maintenance protocols need an upgrade to withstand increasingly severe monsoon seasons.',
      content: 'The 2026 Highway Infrastructure Audit has concluded that routine maintenance protocols need an upgrade to withstand increasingly severe monsoon seasons. The audit reviewed over 1,500 kilometers of state highways. Recommendations highlight the use of porous asphalt, improved drainage culverts, and regular structural integrity testing for bridges older than 20 years. The government has already allocated preliminary funds to address the most critical segments identified in this report.'
    }
  ];

  return (
    <div className="w-full relative">
      {/* 1. READ MORE GRID (White Section) */}
      <section className="bg-white py-16 px-4 md:px-12 w-full">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-end mb-10 border-b-2 border-gray-100 pb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-natpac-primary relative inline-block">
              Latest Insights
              <span className="absolute -bottom-[18px] left-0 w-1/2 h-[4px] bg-natpac-accent rounded-full"></span>
            </h2>
            <button className="text-[#0A1E42] font-medium hover:text-natpac-accent transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insightsData.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col group hover:shadow-lg transition-shadow relative pb-16">
                <div className="h-48 overflow-hidden cursor-pointer" onClick={() => setSelectedInsight(item.id)}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1">
                  <h3 className="text-xl font-bold text-[#0A1E42] mb-3 leading-snug cursor-pointer hover:text-natpac-accent transition-colors" onClick={() => setSelectedInsight(item.id)}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4 text-natpac-accent" />
                    <span>{item.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {item.summary}
                  </p>
                </div>
                {/* Pill Button Anchored Bottom-Right */}
                <button 
                  onClick={() => setSelectedInsight(item.id)}
                  className="absolute bottom-4 right-4 bg-natpac-primary text-white text-xs font-semibold tracking-wider px-5 py-2 rounded-full hover:bg-[#0A1E42] transition-colors"
                >
                  Read More &gt;&gt;
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. DARK FEATURE CARDS (Light Bg Section) */}
      <section className="bg-natpac-lightBg py-16 px-4 md:px-12 w-full">
        <div className="max-w-screen-xl mx-auto">
          <div className="border-b-2 border-gray-200 pb-4 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-natpac-primary relative inline-block">
              Key Initiatives
              <span className="absolute -bottom-[18px] left-0 w-1/2 h-[4px] bg-natpac-accent rounded-full"></span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Navy Gradient Card */}
            <div className="rounded-2xl p-8 bg-gradient-to-br from-natpac-primary to-[#0f2d61] text-white shadow-xl relative pb-20 group">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Activity className="w-8 h-8 text-natpac-accent" /> What's New
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-natpac-accent shrink-0 mt-0.5" />
                  <span className="text-gray-200">Implementation of AI-based traffic signal coordination in Trivandrum.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-natpac-accent shrink-0 mt-0.5" />
                  <span className="text-gray-200">Release of the annual Kerala Road Safety Audit Report.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-natpac-accent shrink-0 mt-0.5" />
                  <span className="text-gray-200">New multi-modal transit hub feasibility study finalized.</span>
                </li>
              </ul>
              {/* Simple Minimalist Button */}
              <button 
                onClick={() => setSelectedInitiative('updates')}
                className="absolute bottom-6 right-6 bg-white text-natpac-primary px-6 py-2 rounded-full font-bold text-sm hover:bg-natpac-accent hover:text-white transition-colors shadow-md"
              >
                View All Updates
              </button>
            </div>

            {/* Indigo Gradient Card */}
            <div className="rounded-2xl p-8 bg-gradient-to-br from-natpac-secondary to-[#3a0d82] text-white shadow-xl relative pb-20 group">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <MapPin className="w-8 h-8 text-natpac-accent" /> Upcoming Events
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-natpac-accent shrink-0 mt-0.5" />
                  <span className="text-gray-200">National Symposium on Sustainable Urban Mobility - Sept 12.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-natpac-accent shrink-0 mt-0.5" />
                  <span className="text-gray-200">Stakeholder Workshop: Waterway Navigation Standards - Oct 04.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-natpac-accent shrink-0 mt-0.5" />
                  <span className="text-gray-200">Training Session for Highway Engineers on Pavement Tech.</span>
                </li>
              </ul>
              <button 
                onClick={() => setSelectedInitiative('events')}
                className="absolute bottom-6 right-6 bg-white text-natpac-secondary px-6 py-2 rounded-full font-bold text-sm hover:bg-natpac-accent hover:text-white transition-colors shadow-md"
              >
                Event Calendar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ICON FEATURE GRID (Solid Blue with Waves) */}
      <section className="relative bg-[#0A1E42] pt-24 pb-32 px-4 md:px-12 w-full mt-12 mb-12">
        {/* Top Wave */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform -translate-y-[98%]">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,115.46,192.5,98.6,238.16,86.07,281.94,70.21,321.39,56.44Z" className="fill-[#0A1E42] transform rotate-180 origin-center"></path>
          </svg>
        </div>
        
        {/* Diagonal Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
        
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white relative inline-block">
              Scientific Divisions
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-natpac-accent rounded-full"></span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {[
              { title: 'Traffic Safety', id: 'division-traffic', icon: ShieldCheck },
              { title: 'Public Transport', id: 'division-public', icon: Bus },
              { title: 'Highway Engineering', id: 'division-highway', icon: HardHat },
              { title: 'Transport Planning', id: 'division-planning', icon: MapPin }
            ].map((div, i) => (
              <div key={i} className="bg-white rounded-xl p-8 pt-10 text-center flex flex-col items-center shadow-xl transform hover:-translate-y-2 transition-transform relative mt-4">
                {/* Overlapping Icon Badge */}
                <div className="w-16 h-16 rounded-full bg-white border-4 border-natpac-lightBg shadow-md flex items-center justify-center absolute -top-8 text-[#0A1E42]">
                  <div.icon className="w-8 h-8" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-natpac-primary">{div.title}</h3>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                  Specialized research focusing on optimization, safety, and infrastructure resilience.
                </p>
                <button 
                  onClick={() => onTabChange && onTabChange(div.id)}
                  className="mt-6 text-natpac-accent font-bold text-sm uppercase tracking-wider hover:text-natpac-primary transition-colors"
                >
                  Explore
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[98%]">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,115.46,192.5,98.6,238.16,86.07,281.94,70.21,321.39,56.44Z" className="fill-[#0A1E42]"></path>
          </svg>
        </div>
      </section>

      {/* 4. ABOUT NATPAC TEXT SECTION */}
      <section className="bg-white py-16 px-4 md:px-12 w-full mt-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-natpac-primary relative inline-block">
              About NATPAC
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-natpac-accent rounded-full"></span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-gray-700 leading-relaxed">
            <div>
              <h3 className="text-2xl font-bold text-[#0A1E42] mb-4 flex items-center gap-2">
                <span className="w-8 h-1 bg-natpac-accent inline-block"></span>
                Origin & Growth
              </h3>
              <p className="mb-4">
                National Transportation Planning and Research Centre (NATPAC) was established by the Government of Kerala in 1976 to develop solutions to the traffic and transportation problems faced by the State. Owing to the contributions and achievements made by the institute, NATPAC was reconstituted as an autonomous R&D Centre under the Science, Technology and Environment Committee (STEC), Government of Kerala, in 1982. In November 2002, NATPAC was amalgamated with Kerala State Council for Science, Technology and Environment (KSCSTE).
              </p>
              <p className="mb-4">
                Across nearly five decades of evolution, NATPAC has emerged as a pivotal institution shaping Kerala’s transport landscape and contributing substantially to mobility initiatives. Its milestones range from early involvement in the 1982 Delhi Asiad to foundational studies that led to the declaration of National Waterway No. 3.
              </p>
              <p>
                The organisation’s wide-ranging applied research and consultancy engagements, including road safety audits, accident analyses, tourism mobility planning, environmental assessments, and large-scale infrastructure studies, reflect its indispensable role in supporting government decision-making.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#0A1E42] mb-4 flex items-center gap-2">
                <span className="w-8 h-1 bg-natpac-accent inline-block"></span>
                The Organisation
              </h3>
              <p className="mb-4">
                NATPAC is one of the Research Institutions of KSCSTE, which is fully funded by the Government of Kerala. NATPAC is headed by the Director, who is advised on technical matters by the Research Council and on administrative matters by the Management Committee.
              </p>
              <p className="mb-4">
                The main campus of NATPAC with a built-up area of 16,000 sq.ft, housing the scientific divisions, laboratories and library, is located in Thiruvananthapuram. NATPAC also has two Regional Offices in North and Central Kerala.
              </p>
              <div className="bg-natpac-lightBg rounded-xl p-6 border-l-4 border-natpac-accent mt-6">
                <h4 className="font-bold text-natpac-primary mb-3">Major Research Thrust Areas:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#0A1E42]"></div>Traffic Safety & Intelligent Transportation Systems</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#0A1E42]"></div>Marginal/Alternate materials for Transport Infrastructure</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#0A1E42]"></div>Public Transport System and Logistics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Overlay for Insights */}
      {selectedInsight !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedInsight(null)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {insightsData.filter(i => i.id === selectedInsight).map(insight => (
              <div key={insight.id}>
                <div className="relative h-64 w-full">
                  <img src={insight.image} alt={insight.title} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setSelectedInsight(null)}
                    className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4 text-natpac-accent" />
                    <span>{insight.date}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-natpac-primary mb-6">{insight.title}</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {insight.content}
                  </p>
                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <button 
                      onClick={() => setSelectedInsight(null)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Overlay for Initiatives */}
      {selectedInitiative !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedInitiative(null)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedInitiative(null)}
              className="absolute top-6 right-6 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl md:text-3xl font-bold text-natpac-primary mb-6 pr-8">
              {selectedInitiative === 'updates' ? 'All Updates & Initiatives' : 'Detailed Event Calendar'}
            </h2>
            
            {selectedInitiative === 'updates' ? (
              <div className="space-y-6">
                <div className="p-4 bg-natpac-lightBg rounded-lg border-l-4 border-natpac-accent">
                  <h3 className="font-bold text-[#0A1E42] mb-2">Phase 1 of AI-Signal Coordination Live</h3>
                  <p className="text-gray-600 text-sm">Trivandrum's 15 major intersections are now operating under the adaptive signal system, showing a 12% reduction in peak-hour wait times.</p>
                </div>
                <div className="p-4 bg-natpac-lightBg rounded-lg border-l-4 border-natpac-accent">
                  <h3 className="font-bold text-[#0A1E42] mb-2">Multi-modal Transit Hub Feasibility Report</h3>
                  <p className="text-gray-600 text-sm">The finalized 400-page report has been submitted to the state government, proposing a unified hub integrating rail, metro, and city bus terminals in Ernakulam.</p>
                </div>
                <div className="p-4 bg-natpac-lightBg rounded-lg border-l-4 border-natpac-accent">
                  <h3 className="font-bold text-[#0A1E42] mb-2">Statewide Road Safety Audit</h3>
                  <p className="text-gray-600 text-sm">Annual review completed across 2,000 km of state highways, resulting in 45 recommended infrastructural tweaks for accident prevention.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex gap-4 p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="bg-natpac-secondary text-white p-3 rounded-lg text-center min-w-[70px]">
                    <div className="text-xs uppercase font-bold tracking-wider">Sep</div>
                    <div className="text-2xl font-bold">12</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-natpac-primary">National Symposium on Sustainable Urban Mobility</h3>
                    <p className="text-sm text-gray-500 mt-1">Location: Thiruvananthapuram HQ</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="bg-natpac-secondary text-white p-3 rounded-lg text-center min-w-[70px]">
                    <div className="text-xs uppercase font-bold tracking-wider">Oct</div>
                    <div className="text-2xl font-bold">04</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-natpac-primary">Stakeholder Workshop: Navigation Standards</h3>
                    <p className="text-sm text-gray-500 mt-1">Location: Virtual Conference</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="bg-natpac-secondary text-white p-3 rounded-lg text-center min-w-[70px]">
                    <div className="text-xs uppercase font-bold tracking-wider">Nov</div>
                    <div className="text-2xl font-bold">15</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-natpac-primary">Highway Engineers Pavement Tech Training</h3>
                    <p className="text-sm text-gray-500 mt-1">Location: Kozhikode Regional Office</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedInitiative(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AboutNatpac;
