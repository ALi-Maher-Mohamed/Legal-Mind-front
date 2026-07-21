// src/services/chat.service.ts
import { Message, Attachment } from '@/types/chat.types';

const MOCK_ANSWERS = {
  lease: `**مراجعة العقد بالذكاء الاصطناعي - عقد إيجار تجاري**

*   **المخاطر المكتشفة (٢):**
    1.  **زيادة الإيجار العشوائية:** المادة ٤.٢ تمنح المؤجر الحق في زيادة الأجرة السنوية بنسبة تصل إلى ١٥٪ دون الاستناد لمؤشرات السوق العقاري المحلية.
    2.  **مسؤولية الصيانة:** البند ٨.١ يلقي بمسؤولية الإصلاحات الهيكلية والصيانة الرئيسية على عاتق المستأجر.
*   **التوصية المقترحة:**
    *   إعادة التفاوض لتحديد حد أقصى للزيادة السنوية لا يتجاوز ٥٪ تماشياً مع المؤشر العقاري الوطني.
    *   تعديل بند الصيانة ليتحمل المؤجر تكلفة أي صيانة إنشائية أو هيكلية.`,
  developer: `**توليد العقد بالذكاء الاصطناعي - اتفاقية عمل حر لمطور برمجيات**

ملخص البنود التي تم إعدادها:
*   **دفعات المشروع:** ٣٠٪ مقدم، ٤٠٪ عند تسليم النسخة التجريبية، ٣٠٪ عند تسليم الأكواد النهائية.
*   **انتقال الملكية الفكرية:** تنتقل حقوق الملكية الفكرية والبرمجية بالكامل للعميل فقط بعد سداد الدفعة الأخيرة بالكامل.
*   **حدود المسؤولية:** تقتصر مسؤولية المطور على إجمالي قيمة العقد المستلمة فقط.

*يمكنك تنزيل مسودة العقد الكاملة بصيغة Word عبر لوحة التحكم.*`,
  default: `أهلاً بك. بناءً على استفسارك القانوني:
1. تنص القوانين التجارية العامة على أن العقود شريعة المتعاقدين وتعتبر ملزمة فور التوقيع ما لم تخالف النظام العام.
2. يرجى توضيح طبيعة المعاملة (شركات، عقارات، نزاع عمالي) لنتمكن من تزويدك بالنصوص النظامية الدقيقة والمحدثة.`,
};

export const chatService = {
  sendMessage: (content: string, attachments: Attachment[] = []): Promise<Message> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const text = content.toLowerCase();
        let reply = '';

        const hasAttachment = attachments.length > 0;

        if (
          hasAttachment ||
          text.includes('إيجار') ||
          text.includes('عقد') ||
          text.includes('ايجار')
        ) {
          reply = MOCK_ANSWERS.lease;
        } else if (
          text.includes('برمجيات') ||
          text.includes('برمجة') ||
          text.includes('مستقل') ||
          text.includes('عمل حر')
        ) {
          reply = MOCK_ANSWERS.developer;
        } else {
          reply = MOCK_ANSWERS.default;
        }

        resolve({
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
      }, 1500);
    });
  },
};
