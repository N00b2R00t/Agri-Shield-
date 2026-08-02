import React from 'react';
import { CommunityReport, UserProfile } from '../../types';
import { CommunityIntel as CommunityIntelBase } from '../../components/CommunityIntel';

interface CommunityIntelProps {
  reports: CommunityReport[];
  user: UserProfile;
  onAddReport?: (report: Partial<CommunityReport>) => void;
  onUpvoteReport?: (id: string) => void;
  onVerifyReport?: (id: string) => void;
  onDeleteReport?: (id: string) => void;
}

export const CommunityIntel: React.FC<CommunityIntelProps> = ({
  reports = [],
  user,
  onAddReport = () => {},
  onUpvoteReport = () => {},
  onVerifyReport = () => {},
  onDeleteReport = () => {},
}) => {
  const isExtensionOfficer = user.role === 'extension_officer' || user.role === 'admin' || user.role === 'ngo';

  return (
    <CommunityIntelBase
      reports={reports}
      onAddReport={onAddReport}
      onUpvoteReport={onUpvoteReport}
      onVerifyReport={onVerifyReport}
      isExtensionOfficer={isExtensionOfficer}
      onRequestOpenMapWithReport={() => {}}
      onDeleteReport={onDeleteReport}
    />
  );
};
