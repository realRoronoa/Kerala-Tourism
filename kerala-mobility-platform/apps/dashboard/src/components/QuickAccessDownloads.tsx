import React from 'react';
import { MOCK_DOWNLOADS } from '../data/mockDashboardData';
import { Download } from 'lucide-react';

const QuickAccessDownloads: React.FC = () => {
  return (
    <div className="bg-white border-t border-gray-300 mt-8">
      {/* Section Header */}
      <div className="bg-gray-100 border-b border-gray-300 px-6 py-3">
        <h3 className="text-sm font-semibold text-gov-blue-primary uppercase tracking-wide">
          Quick Access — Reports &amp; Downloads
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Official mobility reports, shapefiles, and raw data extracts
        </p>
      </div>

      {/* Table-style list — like gov portals */}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gov-blue-primary text-white text-xs uppercase tracking-wider">
            <th className="text-left px-6 py-2.5 font-medium w-1/2">Document / File</th>
            <th className="text-center px-4 py-2.5 font-medium">Format</th>
            <th className="text-center px-4 py-2.5 font-medium">Size</th>
            <th className="text-center px-4 py-2.5 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_DOWNLOADS.map((item, index) => (
            <tr
              key={item.id}
              className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <td className="px-6 py-3 text-gov-blue-primary font-normal">
                {item.title}
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-300 px-2 py-0.5">
                  {item.type}
                </span>
              </td>
              <td className="px-4 py-3 text-center text-xs text-gray-500">
                {item.size}
              </td>
              <td className="px-4 py-3 text-center">
                <a
                  href={item.url}
                  className="inline-flex items-center gap-1.5 text-xs text-gov-blue-primary hover:underline font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuickAccessDownloads;
