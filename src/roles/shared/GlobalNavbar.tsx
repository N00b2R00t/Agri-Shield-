import React from 'react';
import { Navbar as OriginalNavbar } from '../../components/Navbar';
import { UserProfile, Farm, AlertNotification } from '../../types';

interface SharedGlobalNavbarProps {
  user: UserProfile;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  notifications: AlertNotification[];
  farms: Farm[];
  activeFarm: Farm | null;
  setActiveFarm: (farm: Farm | null) => void;
  onOpenAssistant: () => void;
  onOpenProfile: () => void;
  onOpenNewFarm: () => void;
  onOpenSettings: () => void;
  onOpenDoc: () => void;
  isAuthenticated: boolean;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onSignOut: () => void;
}

export const SharedGlobalNavbar: React.FC<SharedGlobalNavbarProps> = (props) => {
  return <OriginalNavbar {...props} />;
};
