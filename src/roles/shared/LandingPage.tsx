import React from 'react';
import { LandingPage as OriginalLandingPage } from '../../components/LandingPage';

interface SharedLandingPageProps {
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const SharedLandingPage: React.FC<SharedLandingPageProps> = ({ onOpenAuth }) => {
  return <OriginalLandingPage onOpenAuth={onOpenAuth} />;
};
