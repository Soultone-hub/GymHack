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
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm my-4">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-blue-600" />
        <h4 className="font-bold text-sm text-slate-900">
          Conseil d'exécution & posture
        </h4>
      </div>

      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs text-slate-700 space-y-2">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            Privilégiez la propreté du mouvement et le contrôle musculaire sur l'ensemble de l'amplitude.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            Expirez lors de l'effort principal et gardez la sangle abdominale gainée.
          </p>
        </div>
      </div>
    </div>
  );
};
