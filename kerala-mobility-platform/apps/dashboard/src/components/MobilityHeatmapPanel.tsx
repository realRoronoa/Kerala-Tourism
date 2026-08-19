import React from 'react';

const MobilityHeatmapPanel: React.FC = () => {
  return (
    <div className="font-sans h-full flex flex-col">
      <div className="mb-3">
        <h3 className="text-[16px] font-bold text-[#0a1a4a] m-0 border-l-[3px] border-[#FF9933] pl-2 leading-tight">
          Kerala Spatial Density Heatmap
        </h3>
        <p className="text-[12px] text-[#5a5f6d] mt-1 pl-3 m-0">Geospatial corridor density and hub distribution</p>
      </div>

      <div className="bg-white border border-[#d7dce6] overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0a1a4a]">
              <th scope="col" className="px-3 py-2 font-semibold text-[12px] text-white border-r border-[#ffffff]/20">Element</th>
              <th scope="col" className="px-3 py-2 font-semibold text-[12px] text-white border-r border-[#ffffff]/20">Type</th>
              <th scope="col" className="px-3 py-2 font-semibold text-[12px] text-white">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d7dce6]">
            {[
              { id: '1', desc: 'Thiruvananthapuram — Kochi Corridor', type: 'Primary Corridor', status: 'High Density' },
              { id: '2', desc: 'Kochi — Kozhikode Corridor', type: 'Primary Corridor', status: 'Medium Density' },
              { id: '3', desc: 'Major Dwell Stop Hub Clusters', type: 'Transit Hub', status: 'High Density' },
              { id: '4', desc: 'District-Wise OD Matrix Active', type: 'Data Matrix', status: 'Live' }
            ].map((row, i) => (
              <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}>
                <td className="px-3 py-2 text-[13px] font-medium text-[#1a1a1a] border-r border-[#d7dce6]">{row.desc}</td>
                <td className="px-3 py-2 text-[12px] text-[#5a5f6d] border-r border-[#d7dce6] uppercase tracking-wide">{row.type}</td>
                <td className="px-3 py-2 text-[12px] font-semibold text-[#0a1a4a]">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MobilityHeatmapPanel;
