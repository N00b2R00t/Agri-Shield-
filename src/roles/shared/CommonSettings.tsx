import React from 'react';
import { SettingsModal, ThemeMode } from '../../components/SettingsModal';
import { UserProfile, UserRole } from '../../types';

interface SharedCommonSettingsProps {
  user: UserProfile;
  usersList: UserProfile[];
  onClose: () => void;
  onUpdateUser: (updated: UserProfile) => void;
  onUpdateUserRole: (id: string, newRole: UserRole) => void;
  onSignOut: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onDeleteUser?: (id: string) => void;
  onRefreshData?: () => void;
}

export const SharedCommonSettings: React.FC<SharedCommonSettingsProps> = (props) => {
  return <SettingsModal {...props} />;
};
