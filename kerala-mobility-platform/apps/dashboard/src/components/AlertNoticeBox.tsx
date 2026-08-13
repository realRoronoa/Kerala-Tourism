import React from 'react';
import { AlertCircle } from 'lucide-react';

const AlertNoticeBox: React.FC = () => {
  return (
    <div className="bg-orange-50 border border-orange-200 border-l-4 border-l-accent-orange p-6 my-8 flex items-start gap-4 shadow-sm">
      <AlertCircle className="w-6 h-6 text-accent-orange flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="text-lg font-bold text-gray-900">System Notice: GTFS Reconciliation Delay</h3>
        <p className="text-gray-700 mt-2 leading-relaxed">
          The public transit data reconciliation module is currently experiencing a sync lag of approximately 15 minutes with the KSRTC central database. Private mode share and traffic sensor data remain unaffected and are operating in real-time. Maintenance teams have been notified.
        </p>
      </div>
    </div>
  );
};

export default AlertNoticeBox;
