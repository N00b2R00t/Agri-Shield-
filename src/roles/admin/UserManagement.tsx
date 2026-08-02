import React from 'react';
import {
  UserProfile,
  UserRole,
  Farm,
  CommunityReport,
  DiseaseRiskPrediction,
  UserReportItem,
} from '../../types';
import { AdminUserManagement } from '../../components/AdminUserManagement';

interface AdminUserMgmtProps {
  user: UserProfile;
  usersList: UserProfile[];
  farms?: Farm[];
  reports?: CommunityReport[];
  predictions?: DiseaseRiskPrediction[];
  userReports?: UserReportItem[];
  onAddUser?: (user: UserProfile) => void;
  onUpdateRole: (id: string, newRole: UserRole) => void;
  onToggleUserSuspend?: (id: string) => void;
  onDeleteProfile?: (id: string) => void;
  onDeleteFarm?: (id: string) => void;
  onUpdateFarm?: (farm: Farm) => void;
  onDeleteReport?: (id: string) => void;
  onDeletePrediction?: (id: string) => void;
  onVerifyReport?: (id: string) => void;
  onResolveUserReport?: (id: string, status: 'actioned' | 'dismissed') => void;
  onRefreshData?: () => void;
}

export const UserManagement: React.FC<AdminUserMgmtProps> = ({
  user,
  usersList,
  farms = [],
  reports = [],
  predictions = [],
  userReports = [],
  onAddUser = () => {},
  onUpdateRole,
  onToggleUserSuspend,
  onDeleteProfile = () => {},
  onDeleteFarm,
  onUpdateFarm,
  onDeleteReport,
  onDeletePrediction,
  onVerifyReport,
  onResolveUserReport,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <h2 className="text-xl font-bold text-white">System Administration & Moderation Headquarters</h2>
        <p className="text-xs text-stone-400">
          Manage accounts, suspend fake posters, edit farms & livestock records, and moderate published outbreaks.
        </p>
      </div>

      <AdminUserManagement
        currentUser={user}
        usersList={usersList}
        farms={farms}
        reports={reports}
        predictions={predictions}
        userReports={userReports}
        onAddUser={onAddUser}
        onUpdateUserRole={onUpdateRole}
        onToggleUserSuspend={onToggleUserSuspend}
        onDeleteUser={onDeleteProfile}
        onDeleteFarm={onDeleteFarm}
        onUpdateFarm={onUpdateFarm}
        onDeleteReport={onDeleteReport}
        onDeletePrediction={onDeletePrediction}
        onVerifyReport={onVerifyReport}
        onResolveUserReport={onResolveUserReport}
      />
    </div>
  );
};
