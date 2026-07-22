import type { Citation, ConsultMessage } from '@/types/consultation.types';

export function collectCitations(messages: ConsultMessage[]): Citation[] {
  const out: Citation[] = [];
  for (const msg of messages) {
    for (const cit of msg.citations ?? []) {
      if (!out.find((c) => c.id === cit.id)) out.push(cit);
    }
  }
  return out;
}

export function cleanSpeechText(text: string): string {
  return text
    .replace(/\[\d+\]/g, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/[*#_]/g, '');
}

export function buildMockReply(userText: string): ConsultMessage {
  return {
    id: `msg-${Date.now()}-ai`,
    role: 'assistant',
    text: `بناءً على استفسارك («${userText.slice(0, 80)}${userText.length > 80 ? '…' : ''}»)، يمكن تلخيص الموقف القانوني كالتالي:\n\n١. يُراعى مبدأ العقد شريعة المتعاقدين مع عدم مخالفة النظام العام.\n٢. يُفضّل توثيق الاستناد إلى نصوص محددة قبل اتخاذ إجراء تعاقدي.\n٣. أنصح بمراجعة السياق الكامل للملف قبل الاعتماد النهائي على هذه الخلاصة.`,
    timestamp: new Date().toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    citations: [
      {
        id: `cit-${Date.now()}`,
        sourceName: 'القانون المدني المصري — مبادئ عامة',
        excerpt: 'تُفسر العقود بما يتفق مع حسن النية والعرف الجاري في المعاملات.',
        page: 1,
      },
    ],
  };
}
