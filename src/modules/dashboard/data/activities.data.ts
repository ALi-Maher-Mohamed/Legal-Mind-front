import type { Locale } from '@/config/translations';
import type { DeskActivity } from '@/types/dashboard.types';

const EN: DeskActivity[] = [
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

const AR: DeskActivity[] = [
  {
    id: 1,
    type: 'audit',
    title: 'تم استكمال تحليل وتدقيق المستند',
    desc: 'أعاد فحص اتفاقية عدم الإفصاح المرفوعة Apex_NDA_Final.pdf نسبة مطابقة تبلغ ٩٨٪. تم رصد ٣ مؤشرات لمخاطر صياغية في بند التعويضات.',
    time: '١٠:٣٢ ص',
    date: 'اليوم',
    detail:
      'أشار المستشار المدعوم بالذكاء الاصطناعي إلى أن المادة ٩.٢ (شروط التعويض والضمان) تفتقر إلى حدود المسؤولية المتبادلة.',
  },
  {
    id: 2,
    type: 'chat',
    title: 'فهرسة وتوثيق سابقة قضائية جديدة',
    desc: 'استكمل المستشار جلسة المشورة المتعلقة بحدود بند عدم المنافسة الجغرافية. تم إلحاق مرجعين قضائيين إلى حافظة القضية.',
    time: 'أمس',
    date: '١٢ يوليو',
    detail: 'استندت جلسة الاستشارة إلى نص المادة ١٨٨ من القانون المدني والمبادئ المستقرة للتمييز.',
  },
  {
    id: 3,
    type: 'draft',
    title: 'صياغة عقد ذكي مخصص',
    desc: "تمت صياغة عقد عمل لمنصب 'مدير أول للأنظمة والامتثال' خاضع لولاية القاهرة. بنود ثنائية اللغة.",
    time: 'منذ ٣ أيام',
    date: '١٠ يوليو',
    detail: 'تم إنشاؤه من نموذج استوديو الصياغة مع تخصيص التعويضات وفترات التجربة والتحكيم.',
  },
];

export function getDeskActivities(locale: Locale): DeskActivity[] {
  return locale === 'ar' ? AR : EN;
}
