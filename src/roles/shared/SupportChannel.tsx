import React from 'react';
import { FarmerSupport } from '../farmer/Support';
import { UserProfile } from '../../types';

interface SharedSupportChannelProps {
  user: UserProfile;
  onOpenDocModal?: () => void;
}

export const SharedSupportChannel: React.FC<SharedSupportChannelProps> = (props) => {
  return <FarmerSupport {...props} />;
};
