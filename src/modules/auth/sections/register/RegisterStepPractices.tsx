'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { getPracticeAreas } from '../../data/practiceAreas.data';
import PracticeChip from '../../components/PracticeChip';

type Props = {
  selected: string[];
  onToggle: (practice: string) => void;
};

export default function RegisterStepPractices({ selected, onToggle }: Props) {
  const { t, locale, isRtl } = useLanguage();
  const areas = getPracticeAreas(locale);

  return (
    <div className="space-y-3 pt-2">
      <span className={`text-xs text-gray-500 block ${isRtl ? 'text-right' : 'text-left'}`}>
        {t.auth.practicesLabel}
      </span>
      <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1" role="group" aria-label={t.auth.practicesLabel}>
        {areas.map((area) => (
          <PracticeChip
            key={area}
            label={area}
            selected={selected.includes(area)}
            onToggle={() => onToggle(area)}
          />
        ))}
      </div>
    </div>
  );
}
