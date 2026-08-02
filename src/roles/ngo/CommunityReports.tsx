import React from 'react';
import { CommunityReport, UserProfile } from '../../types';
import { CommunityIntel } from '../../components/CommunityIntel';

interface NGOCommunityReportsProps {
  reports: CommunityReport[];
  user: UserProfile;
  onAddReport?: (report: Partial<CommunityReport>) => void;
  onUpvoteReport?: (id: string) => void;
  onVerifyReport?: (id: string) => void;
  onDeleteReport?: (id: string) => void;
}

export const NGOCommunityReports: React.FC<NGOCommunityReportsProps> = ({
  reports,
  user,
  onAddReport = () => {},
  onUpvoteReport = () => {},
  onVerifyReport = () => {},
  onDeleteReport = () => {},
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <h2 className="text-xl font-bold text-white">NGO Incident Validation & Field Audit Pipeline</h2>
        <p className="text-xs text-stone-400">
          Audit crowdsourced smallholder field reports, verify disaster severity ratings, and issue emergency relief.
        </p>
      </div>

      <CommunityIntel
        reports={reports}
        onAddReport={onAddReport}
        onUpvoteReport={onUpvoteReport}
        onVerifyReport={onVerifyReport}
        isExtensionOfficer={true}
        onRequestOpenMapWithReport={() => {}}
        onDeleteReport={onDeleteReport}
      />
    </div>
  );
};
