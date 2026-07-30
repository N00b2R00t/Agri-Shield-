import React from 'react';
import { UserProfile, UserRole } from '../../types';
import { AdminUserManagement } from '../../components/AdminUserManagement';

interface AdminUserMgmtProps {
  user: UserProfile;
  usersList: UserProfile[];
  onUpdateRole: (id: string, newRole: UserRole) => void;
  onDeleteProfile?: (id: string) => void;
  onRefreshData?: () => void;
}

export const UserManagement: React.FC<AdminUserMgmtProps> = ({
  user,
  usersList,
  onUpdateRole,
  onDeleteProfile,
  onRefreshData,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <h2 className="text-xl font-bold text-white">System User Role Assignment & Access Control</h2>
        <p className="text-xs text-stone-400">Instantly grant Farmer, Extension Officer, NGO, or Admin permissions. Changes sync directly with Database.</p>
      </div>

      <AdminUserManagement
        usersList={usersList}
        activeUser={user}
        onUpdateUserRole={onUpdateRole}
        onDeleteUser={onDeleteProfile}
        onRefreshData={onRefreshData}
      />
    </div>
  );
};
