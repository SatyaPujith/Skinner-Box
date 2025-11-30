import React from 'react';
import { HorrorChase } from './HorrorChase';

interface PenanceProps {
  onComplete: () => void;
  onGiveUp: () => void;
}

export const Penance: React.FC<PenanceProps> = ({ onComplete }) => {
  return <HorrorChase onComplete={onComplete} />;
};
