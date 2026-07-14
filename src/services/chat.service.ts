// src/services/chat.service.ts
import { Message, Attachment } from '@/types/chat.types';

const MOCK_ANSWERS_EN = {
  lease: `**AI Contract Review - Commercial Lease Agreement**

*   **Identified Risks (2):**
    1.  **Arbitrary Rent Escalation:** Section 4.2 allows the landlord to raise rent by up to 15% annually without prior market appraisal.
    2.  **Maintenance Liability:** Clause 8.1 shifts major structural and plumbing repairs onto the tenant.
*   **Recommendation:**
    *   Renegotiate the cap on rent escalation to a maximum of 5% in accordance with local rental index benchmarks.
    *   Amend the maintenance clause to state that the landlord is responsible for all structural elements and exterior walls.`,
  developer: `**AI Contract Generation - Freelance Developer Agreement**

Here is a summary of the draft created:
*   **Payment Milestones:** 30% upfront deposit, 40% upon Beta release, 30% on final source code delivery.
*   **IP Transfer:** Intellectual Property rights will transfer to the client ONLY upon final invoice settlement.
*   **Indemnification:** Limited to the total value of the contract.

*You can copy this outline to generate a full document or download the Word format.*`,
  default: `Thank you for your inquiry. Based on the initial scanning of your question:
1. Under standard civil and commercial law codes, agreements are binding upon bilateral sign-offs.
2. Please clarify if you are dealing with local corporate legislation or an international vendor dispute so I can provide precise citations.`
};

const MOCK_ANSWERS_AR = {
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
2. يرجى توضيح طبيعة المعاملة (شركات، عقارات، نزاع عمالي) لنتمكن من تزويدك بالنصوص النظامية الدقيقة والمحدثة.`
};

export const chatService = {
  sendMessage: (
    content: string,
    locale: 'en' | 'ar',
    attachments: Attachment[] = []
  ): Promise<Message> => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        const text = content.toLowerCase();
        let reply = '';

        const hasAttachment = attachments.length > 0;
        const targetLocale = locale;

        if (targetLocale === 'ar') {
          if (hasAttachment || text.includes('إيجار') || text.includes('عقد') || text.includes('ايجار')) {
            reply = MOCK_ANSWERS_AR.lease;
          } else if (text.includes('برمجيات') || text.includes('برمجة') || text.includes('مستقل') || text.includes('عمل حر')) {
            reply = MOCK_ANSWERS_AR.developer;
          } else {
            reply = MOCK_ANSWERS_AR.default;
          }
        } else {
          if (hasAttachment || text.includes('lease') || text.includes('rent') || text.includes('contract')) {
            reply = MOCK_ANSWERS_EN.lease;
          } else if (text.includes('developer') || text.includes('freelance') || text.includes('software')) {
            reply = MOCK_ANSWERS_EN.developer;
          } else {
            reply = MOCK_ANSWERS_EN.default;
          }
        }

        resolve({
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString(targetLocale === 'ar' ? 'ar-EG' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })
        });
      }, 1500); // 1.5 seconds response delay to showcase typing indicator
    });
  }
};
