import type { Locale } from '@/config/translations';

const PRACTICE_AREAS_EN = [
  'Corporate & Securities',
  'Intellectual Property',
  'Commercial Litigation',
  'Labor & Employment',
  'Mergers & Acquisitions',
  'Maritime & Admiralty',
  'Criminal Defense',
  'Taxation',
  'Estate Planning',
  'Arbitration & ADR',
] as const;

const PRACTICE_AREAS_AR = [
  'الشركات والأوراق المالية',
  'الملكية الفكرية وبراءات الاختراع',
  'التقاضي التجاري والنزاعات',
  'قانون العمل والتوظيف',
  'الاندماج والاستحواذ',
  'القانون البحري والجنائيات',
  'الدفاع الجنائي العام',
  'قوانين الضرائب والجمارك',
  'التخطيط العقاري والمواريث',
  'التحكيم الدولي ومجلس تسوية المنازعات',
] as const;

export function getPracticeAreas(locale: Locale): readonly string[] {
  return locale === 'ar' ? PRACTICE_AREAS_AR : PRACTICE_AREAS_EN;
}
