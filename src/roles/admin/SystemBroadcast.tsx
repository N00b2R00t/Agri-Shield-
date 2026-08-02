import React from 'react';
import { BroadcastDispatcher } from '../extension_officer/BroadcastDispatcher';

interface SystemBroadcastProps {
  onSendNotification?: (notif: {
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'critical';
    type: any;
    targetRole?: 'all' | 'farmer' | 'extension_officer' | 'ngo' | 'admin';
  }) => void;
}

export const SystemBroadcast: React.FC<SystemBroadcastProps> = ({ onSendNotification }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <h2 className="text-xl font-bold text-white">System Director Global Emergency Broadcast</h2>
        <p className="text-xs text-stone-400">Transmit real-time alerts to all registered system users across all roles.</p>
      </div>

      <BroadcastDispatcher onSendNotification={onSendNotification} />
    </div>
  );
};
