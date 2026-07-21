import type { GazetteDocument } from '@/types/gazette.types';

export const APEX_ANALYSIS: Pick<
  GazetteDocument,
  'summary' | 'clauses' | 'risks' | 'timeline' | 'parties'
> = {
  summary:
    'اتفاقية عدم إفصاح ثنائية بين Apex Technologies و Counselor Solutions. البنود الجوهرية سليمة مع استثناء واحد: التعويض بلا سقف مسؤولية.',
  clauses: [
    {
      id: 'cl-1',
      type: 'Confidentiality',
      title: 'البند ٢ — ضمانات عدم الإفصاح',
      text: 'الالتزام بالسرية المطلقة لجميع المعلومات الفنية والمالية لمدة خمس (٥) سنوات.',
      confidence: 96,
    },
    {
      id: 'cl-2',
      type: 'IP Assignment',
      title: 'البند ٣ — التنازل عن الملكية الفكرية',
      text: 'جميع مخرجات العمل الفكرية والكود المصدري تعود ملكيتها الحصرية للعميل.',
      confidence: 98,
    },
    {
      id: 'cl-3',
      type: 'Governing Law',
      title: 'البند ٨ — تسوية النزاعات',
      text: 'يخضع الاتفاق لقوانين ولاية ديلاوير، ولمحاكم ويلمنغتون الاختصاص الحصري.',
      confidence: 94,
    },
    {
      id: 'cl-4',
      type: 'Indemnification',
      title: 'البند ٩ — التزامات التعويض',
      text: 'يوافق المزود على تعويض العميل من أي مطالبات دون حدود أقصى للمسؤولية.',
      confidence: 91,
    },
  ],
  risks: [
    {
      id: 'rk-1',
      level: 'high',
      description: 'تعويض غير محدود دون سقف مسؤولية على المزود',
      suggestion:
        'إدراج حد أقصى للتعويض يساوي إجمالي قيمة العقد أو مبلغاً متفقاً عليه صراحة.',
    },
    {
      id: 'rk-2',
      level: 'medium',
      description: 'الاختصاص القضائي في ديلاوير يرفع تكلفة التقاضي لمكاتب القاهرة',
      suggestion: 'اقتراح تحكيم في القاهرة أو اختصاص محلي بديل كخيار أول.',
    },
  ],
  timeline: [
    {
      id: 'tm-1',
      date: 'عند التوقيع',
      party: 'كلا الطرفين',
      description: 'سريان التزامات السرية المتبادلة',
    },
    {
      id: 'tm-2',
      date: '+ ٥ سنوات',
      party: 'المزود',
      description: 'انتهاء مدة السرية العامة (باستثناء الأسرار التجارية)',
    },
  ],
  parties: [
    {
      id: 'pt-1',
      name: 'Apex Technologies Group Inc.',
      role: 'العميل',
      rights: 'ملكية حصرية للمخرجات الفكرية وحق التعويض',
      obligations: 'دفع المستحقات والحفاظ على سرية معلومات المزود',
    },
    {
      id: 'pt-2',
      name: 'Counselor Solutions LLC',
      role: 'المزود',
      rights: 'الحصول على الأتعاب المتفق عليها',
      obligations: 'السرية، التسليم، والتعويض بلا سقف حالياً',
    },
  ],
};
