import type { Locale } from '@/config/translations';
import type { DeskActivity, DeskObligation } from '@/types/dashboard.types';

export function getDeskActivities(locale: Locale): DeskActivity[] {
  if (locale === 'ar') {
    return [
      {
        id: 1,
        type: 'audit',
        title: 'تم استكمال تحليل وتدقيق المستند',
        desc: 'أعاد فحص اتفاقية عدم الإفصاح المرفوعة Apex_NDA_Final.pdf نسبة مطابقة تبلغ ٩٨٪. تم رصد ٣ مؤشرات لمخاطر صياغية في بند التعويضات.',
        time: '١٠:٣٢ ص',
        date: 'اليوم',
        detail:
          'أشار المستشار المدعوم بالذكاء الاصطناعي إلى أن المادة ٩.٢ (شروط التعويض والضمان) تفتقر إلى حدود المسؤولية المتبادلة. تم توفير صياغة بديلة مقترحة في قسم المسودات.',
      },
      {
        id: 2,
        type: 'chat',
        title: 'فهرسة وتوثيق سابقة قضائية جديدة',
        desc: 'استكمل المستشار جلسة المشورة الفقهية المتعلقة بحدود بند عدم المنافسة الجغرافية. تم إلحاق مرجعين قضائيين معتمدين إلى حافظة القضية.',
        time: 'أمس',
        date: '١٢ يوليو',
        detail:
          'استندت جلسة الاستشارة إلى نص المادة ١٨٨ من القانون المدني والمبادئ المستقرة للتمييز. تلخص النتائج المحفوظة المعايير الموضوعية لتحديد النطاق المكاني في عقود التوظيف.',
      },
      {
        id: 3,
        type: 'draft',
        title: 'صياغة عقد ذكي مخصص',
        desc: "تمت صياغة عقد عمل لمنصب 'مدير أول للأنظمة والامتثال' خاضع لولاية ومحاكم القاهرة. تم تنسيق البنود وصياغتها باللغتين العربية والإنجليزية.",
        time: 'منذ ٣ أيام',
        date: '١٠ يوليو',
        detail:
          'تم إنشاؤه من نموذج استوديو الصياغة. تم إدراج وتخصيص المتغيرات المحددة للتعويضات، وفترات التجربة، وقنوات التحكيم المعتمدة.',
      },
    ];
  }

  return [
    {
      id: 1,
      type: 'audit',
      title: 'Document Analysis Completed',
      desc: 'Contract audit on Apex_NDA_Final.pdf returned 98% analysis rating. 3 high-level risk factors were flagged in the Indemnification Clause.',
      time: '10:32 AM',
      date: 'Today',
      detail:
        'The AI Counselor flagged Section 9.2 (Indemnity holds) as lacking bilateral liability caps. Recommended amendment has been generated in Drafts.',
    },
    {
      id: 2,
      type: 'chat',
      title: 'New Precedent Indexed',
      desc: 'Counselor completed consultation regarding Delaware non-compete geographic boundaries. 2 authoritative citations appended to case briefcase.',
      time: 'Yesterday',
      date: 'Jul 12',
      detail:
        'Consultation cited Restatement (Second) of Contracts § 188. Saved findings outline reasonable duration limits for software trade structures.',
    },
    {
      id: 3,
      type: 'draft',
      title: 'Smart Contract Generated',
      desc: "Employment agreement for 'Senior Systems Director' drafted under Cairo jurisdiction. Bilateral Arabic-English clauses formatted.",
      time: '3 days ago',
      date: 'Jul 10',
      detail:
        'Generated from Smart Form. Variable parameters for compensation, probation terms, and standard arbitration channels fully populated.',
    },
  ];
}

export function getDeskObligations(locale: Locale): DeskObligation[] {
  if (locale === 'ar') {
    return [
      {
        day: 14,
        title: 'موعد تقديم مستندات الإفصاح لشركة Apex',
        level: 'high',
        desc: 'استكمال وتسوية الردود القانونية المعلقة لتسليم المعروض ج.',
      },
      {
        day: 22,
        title: 'إخطار تجديد عقد إيجار المقر الإداري',
        level: 'medium',
        desc: 'مراجعة مهلة الـ ٦٠ يوماً السابقة للإخطار لشروط الإيجار الإداري للشركات.',
      },
      {
        day: 28,
        title: 'التحضير لجلسة تحكيم القاهرة الكبرى',
        level: 'high',
        desc: 'تجميع وفهرسة مستندات المذكرة التفصيلية للمراجعة النهائية للمستشارين.',
      },
    ];
  }

  return [
    {
      day: 14,
      title: 'Apex Discovery Filing Due',
      level: 'high',
      desc: 'Settle outstanding responses for exhibit C deliveries.',
    },
    {
      day: 22,
      title: 'Lease Contract Renewal Notice',
      level: 'medium',
      desc: 'Prior 60-day notification threshold for office rental terms.',
    },
    {
      day: 28,
      title: 'Cairo Arbitral Hearing Prep',
      level: 'high',
      desc: 'Assemble indexed brief documents for counsel review.',
    },
  ];
}
