import React from 'react';
import {
  Activity,
  Shield,
  Dumbbell,
  Target,
  Footprints,
  User,
  Maximize2,
  Hand,
  Layers,
  HeartPulse,
} from 'lucide-react';

interface AnatomicalIconProps {
  icon: string;
  className?: string;
  isCardio?: boolean;
}

export const AnatomicalIcon: React.FC<AnatomicalIconProps> = ({
  icon,
  className = 'w-5 h-5',
  isCardio = false,
}) => {
  if (isCardio || icon === 'pulse') {
    return <HeartPulse className={className} />;
  }

  switch (icon) {
    case 'back':
      return <Layers className={className} />;

    case 'chest':
      return <Shield className={className} />;

    case 'arms':
      return <Dumbbell className={className} />;

    case 'shoulders':
      return <Maximize2 className={className} />;

    case 'quads':
    case 'legs':
      return <Footprints className={className} />;

    case 'abs':
    case 'waist':
      return <Target className={className} />;

    case 'calves':
      return <Footprints className={className} />;

    case 'forearms':
      return <Hand className={className} />;

    case 'neck':
      return <User className={className} />;

    default:
      return <Activity className={className} />;
  }
};
