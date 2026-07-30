import React from 'react';
import { AuthModal } from '../../components/AuthModal';
import { UserProfile } from '../../types';

interface SharedAuthContainerProps {
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const SharedAuthContainer: React.FC<SharedAuthContainerProps> = ({
  initialMode,
  onClose,
  onLoginSuccess,
}) => {
  return (
    <AuthModal
      initialMode={initialMode}
      onClose={onClose}
      onLoginSuccess={onLoginSuccess}
    />
  );
};
