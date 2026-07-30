import React from 'react';
import { AIAssistantModal } from '../../components/AIAssistantModal';
import { Farm, WeatherSummary, CommunityReport } from '../../types';

interface SharedAIAssistantProps {
  onClose: () => void;
  farm: Farm | null;
  weather: WeatherSummary;
  reports: CommunityReport[];
}

export const SharedAIAssistant: React.FC<SharedAIAssistantProps> = (props) => {
  return <AIAssistantModal {...props} />;
};
