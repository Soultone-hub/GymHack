import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';

interface TempoGuideWidgetProps {
  tempoString?: string;
  exerciseName: string;
}

export const TempoGuideWidget: React.FC<TempoGuideWidgetProps> = ({
  exerciseName,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-black nb-shadow my-4">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-black" />
        <h4 className="font-body font-bold text-sm text-black">
          Conseil d'exécution pour {exerciseName}
        </h4>
      </div>

      <div className="bg-zinc-50 rounded-xl p-3.5 border-2 border-black text-xs text-black space-y-2">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
          <p className="font-body">
            Privilégiez la propreté du mouvement et le contrôle musculaire sur l'ensemble de l'amplitude.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
          <p className="font-body">
            Expirez lors de l'effort principal et gardez la sangle abdominale gainée.
          </p>
        </div>
      </div>
    </div>
  );
};
