import React from 'react';
import { RoleBanner as OriginalRoleBanner } from '../../components/RoleBanner';
import { UserProfile, UserRole } from '../../types';

interface SharedRoleBannerProps {
  user: UserProfile;
  onRoleChange: (newRole: UserRole) => void;
  onOpenSettingsModal: () => void;
}

export const SharedRoleBanner: React.FC<SharedRoleBannerProps> = (props) => {
  return <OriginalRoleBanner {...props} />;
};
