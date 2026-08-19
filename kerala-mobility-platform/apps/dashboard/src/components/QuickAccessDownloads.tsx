import React from 'react';
import { MOCK_DOWNLOADS } from '../data/mockDashboardData';

// Helper to get text color based on format instead of border
const getFormatTextColor = (type: string) => {
  const t = type.toUpperCase();
  if (t === 'PDF') return 'text-[#C0392B]';
  if (t === 'ZIP') return 'text-[#6C4BA0]';
  if (t === 'SHP') return 'text-[#0E7C7B]';
  if (t === 'XLS' || t === 'CSV') return 'text-[#1E7A34]';
  if (t === 'HTML') return 'text-[#555555]';
  return 'text-[#1a1a1a]';
};

const QuickAccessDownloads: React.FC = () => {
  return (
    <div className="mt-8 font-sans mb-8">
      {/* Breadcrumb */}
      <div className="text-[12px] text-[#5a5f6d] mb-4 font-medium uppercase tracking-wide">
        Home / Data Repository / Downloads
      </div>

      <div className="mb-3">
        <h3 className="text-[16px] font-bold text-[#0a1a4a] m-0 border-l-[3px] border-[#FF9933] pl-2 leading-tight">
          Quick Access — Reports & Downloads
        </h3>
        <p className="text-[12px] text-[#5a5f6d] mt-1 pl-3 m-0">
          Official mobility reports, shapefiles, and raw data extracts — Last updated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="bg-white border border-[#d7dce6] overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#0a1a4a]">
                <th scope="col" className="px-3 py-2 font-semibold text-[12px] text-white border-r border-[#ffffff]/20 w-16">Sl. No.</th>
                <th scope="col" className="px-3 py-2 font-semibold text-[12px] text-white border-r border-[#ffffff]/20">Document / File</th>
                <th scope="col" className="text-center px-3 py-2 font-semibold text-[12px] text-white border-r border-[#ffffff]/20 w-24">Format</th>
                <th scope="col" className="text-right px-3 py-2 font-semibold text-[12px] text-white border-r border-[#ffffff]/20 w-28">Size</th>
                <th scope="col" className="text-center px-3 py-2 font-semibold text-[12px] text-white border-r border-[#ffffff]/20 w-36">Last Updated</th>
                <th scope="col" className="text-center px-3 py-2 font-semibold text-[12px] text-white w-32">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d7dce6]">
              {MOCK_DOWNLOADS.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-[#f4f6fb]'}
                >
                  <td className="px-3 py-2 text-[13px] text-[#1a1a1a] border-r border-[#d7dce6]">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2 text-[13px] text-[#0b3d91] font-medium underline hover:text-[#14307a] cursor-pointer border-r border-[#d7dce6]">
                    {item.title}
                  </td>
                  <td className="px-3 py-2 text-center border-r border-[#d7dce6]">
                    <span className={`text-[12px] font-bold uppercase ${getFormatTextColor(item.type)}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right text-[13px] text-[#1a1a1a] tabular-nums border-r border-[#d7dce6]">
                    {item.size}
                  </td>
                  <td className="px-3 py-2 text-center text-[13px] text-[#1a1a1a] tabular-nums border-r border-[#d7dce6]">
                    {'15 Aug 2026'}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <a
                      href={item.url}
                      onClick={(e) => {
                        if (item.url === '#') {
                          e.preventDefault();
                        }
                      }}
                      className="text-[13px] text-[#0b3d91] underline hover:text-[#14307a] font-medium whitespace-nowrap"
                    >
                      Download &darr;
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="border-t border-[#d7dce6] bg-white px-3 py-2">
          <p className="text-[11px] text-[#5a5f6d] italic m-0">
            Note: PDF files require Adobe Acrobat Reader. ZIP/SHP files require a compatible extraction/GIS tool to view.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickAccessDownloads;
