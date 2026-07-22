import type { ContractTemplate, DraftOutputLang } from '@/types/drafter.types';

export function compileTemplateDraft(
  template: ContractTemplate,
  values: Record<string, string>,
): string {
  let text = `# ${template.name}\n\n`;
  text += `**إقرار صياغة العقد المبدئية**\n\nأُبرم هذا الاتفاق في هذا اليوم الموافق ١٣ يوليو من عام ٢٠٢٦، بين كل من:\n\n`;

  if (template.id === 'tmpl-nda') {
    text += `**${values.party_a || '[الطرف الأول المفصح]'}** (الطرف الأول) و **${values.party_b || '[الطرف الثاني المستلم]'}** (الطرف الثاني).\n\n`;
    text += `### ١. بند السرية ومدتها\n`;
    text += `تظل المعلومات السرية محمية لمدة **${values.conf_duration || '٥ سنوات'}**.\n\n`;
    text += `### ٢. القانون والنزاعات\n`;
    text += `يخضع هذا العقد لأحكام **${values.jurisdiction || 'القانون المدني المصري'}**.\n`;
  } else if (template.id === 'tmpl-labor') {
    text += `**${values.employer || '[صاحب العمل]'}** (الطرف الأول) و **${values.employee || '[الموظف]'}** (الطرف الثاني).\n\n`;
    text += `### ١. الراتب والمستحقات\n`;
    text += `الراتب الشهري الأساسي **${values.salary || '٧٥,٠٠٠ جنيه مصري'}**.\n\n`;
    text += `### ٢. الإخطار والفسخ\n`;
    text += `يُنهى التعاقد بإخطار كتابي مدته **${values.notice_period || '٣٠ يوماً'}**.\n`;
  } else {
    text += `**${values.landlord || '[المؤجر]'}** (الطرف الأول) و **${values.tenant || '[المستأجر]'}** (الطرف الثاني).\n\n`;
    text += `### ١. الشروط الإيجارية\n`;
    text += `الإيجار الشهري **${values.rent_amount || '٥,٠٠٠ دولار'}** مع تأمين **${values.security_deposit || '١٠,٠٠٠ دولار'}**.\n`;
  }

  text += `\n**وإثباتاً لما تقدم**، وقع الطرفان على هذا العقد بنية سليمة.\n`;
  return text;
}

export function buildMockAiDraft(description: string, lang: DraftOutputLang): string {
  const langNote =
    lang === 'Bilingual' ? 'مسودة ثنائية اللغة' : lang === 'English' ? 'مسودة إنجليزية (ملخص عربي)' : 'مسودة عربية';
  return `# مسودة عقد مخصصة — ${langNote}

**وصف الطلب:** ${description}

### ١. الأطراف
يُبرم الاتفاق بين الطرف الأول والطرف الثاني وفق البيانات التي يحددها المستشار لاحقاً.

### ٢. موضوع الاتفاق
يغطي الاتفاق الالتزامات الجوهرية المستخلصة من الوصف المقدَّم، مع مراعاة حسن النية والنظام العام.

### ٣. المدة والإنهاء
تُحدد المدة والإخطار بما يتوافق مع طبيعة العلاقة التعاقدية والقوانين السارية.

### ٤. القانون والاختصاص
ما لم يُتفق على خلاف ذلك، يُرجع إلى أحكام القانون المدني المصري والمحاكم المختصة.

**وإثباتاً لما تقدم**، تُعد هذه المسودة أساساً للمراجعة المهنية قبل التوقيع.
`;
}
