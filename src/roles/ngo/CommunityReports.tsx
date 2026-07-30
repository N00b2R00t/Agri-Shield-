import React from 'react';
import { CommunityReport, UserProfile } from '../../types';
import { CommunityIntel } from '../../components/CommunityIntel';

interface NGOCommunityReportsProps {
  reports: CommunityReport[];
  user: UserProfile;
}

export const NGOCommunityReports: React.FC<NGOCommunityReportsProps> = ({ reports, user }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <h2 className="text-xl font-bold text-white">NGO Incident Validation Pipeline</h2>
        <p className="text-xs text-stone-400">Audit smallholder field reports, confirm severity ratings, and issue relief packages.</p>
      </div>

      <CommunityIntel reports={reports} user={user} />
    </div>
  );
};
