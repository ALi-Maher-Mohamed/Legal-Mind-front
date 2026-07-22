import type { ContractTemplate } from '@/types/drafter.types';

export const DRAFTER_TEMPLATES: ContractTemplate[] = [
  {
    id: 'tmpl-nda',
    name: 'اتفاقية حفظ سرية ثنائية',
    description:
      'تعهد ثنائي قياسي لحفظ السرية وعدم الإفصاح مناسب للمحادثات المؤسسية الاستكشافية أو الاندماجات المشتركة.',
    category: 'الشركات',
    language: 'Arabic',
    variables: [
      {
        name: 'party_a',
        label: 'الطرف الأول المفصح (أ)',
        type: 'text',
        placeholder: 'مثال: شركة أبيكس للتكنولوجيا',
      },
      {
        name: 'party_b',
        label: 'الطرف الثاني المستلم (ب)',
        type: 'text',
        placeholder: 'مثال: مؤسسة كونسيلر',
      },
      {
        name: 'conf_duration',
        label: 'مدة حفظ السرية',
        type: 'select',
        options: ['٣ سنوات', '٥ سنوات', '٧ سنوات', 'غير محددة'],
      },
      {
        name: 'jurisdiction',
        label: 'القانون الواجب التطبيق والاختصاص',
        type: 'text',
        placeholder: 'مثال: القانون المدني المصري',
      },
    ],
  },
  {
    id: 'tmpl-labor',
    name: 'عقد عمل تنفيذي ثنائي',
    description:
      'عقد عمل تفصيلي يحدد فترات الاختبار، وهيكل الرواتب، وتعيين حقوق الملكية الفكرية، وفترات الإخطار.',
    category: 'العمل',
    language: 'Bilingual',
    variables: [
      {
        name: 'employer',
        label: 'الشركة أو صاحب العمل',
        type: 'text',
        placeholder: 'مثال: حلول القاهرة للبرمجيات',
      },
      {
        name: 'employee',
        label: 'اسم الموظف',
        type: 'text',
        placeholder: 'مثال: شريف هارينغتون',
      },
      {
        name: 'salary',
        label: 'الراتب الشهري الأساسي',
        type: 'text',
        placeholder: 'مثال: ٧٥,٠٠٠ جنيه مصري',
      },
      {
        name: 'notice_period',
        label: 'فترة الإخطار لإنهاء التعاقد',
        type: 'select',
        options: ['٣٠ يوماً', '٦٠ يوماً', '٩٠ يوماً'],
      },
    ],
  },
  {
    id: 'tmpl-lease',
    name: 'عقد إيجار تجاري عقاري',
    description:
      'اتفاق يحكم إيجار العقارات التجارية مع تفصيل الصيانة والمرافق والتجديد وتسوية النزاعات.',
    category: 'عقارات',
    language: 'Arabic',
    variables: [
      {
        name: 'landlord',
        label: 'المؤجر / مالك العقار',
        type: 'text',
        placeholder: 'مثال: شركة ويلمنجتون العقارية',
      },
      {
        name: 'tenant',
        label: 'المستأجر',
        type: 'text',
        placeholder: 'مثال: شركة أبيكس للتقنية',
      },
      {
        name: 'rent_amount',
        label: 'القيمة الإيجارية الشهرية',
        type: 'text',
        placeholder: 'مثال: ٥,٠٠٠ دولار',
      },
      {
        name: 'security_deposit',
        label: 'مبلغ التأمين المسترد',
        type: 'text',
        placeholder: 'مثال: ١٠,٠٠٠ دولار',
      },
    ],
  },
];
