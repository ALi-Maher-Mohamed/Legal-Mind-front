'use client';

import type { GazetteDocument } from '@/types/gazette.types';

const mark =
  'cursor-pointer rounded-sm border-b-2 px-1 py-0.5 font-medium transition';

type Props = {
  doc: GazetteDocument;
  onHighlight: (id: string) => void;
};

export default function DocumentBody({ doc, onHighlight }: Props) {
  return (
    <>
      <p>
        إنه في يوم {doc.dateUploaded}، تم تحرير هذا الاتفاق بين الأطراف المذكورين في البند الأول أدناه.
      </p>
      <p>
        تمهيد: حيث يرغب الأطراف في تبادل المعلومات والملفات الفنية لغايات إتمام التعاون المؤسسي
        المقترح، خاضعاً للقوانين واللوائح المحلية السارية.
      </p>

      <h4 className="mt-6 text-xs font-bold uppercase text-brand">البند ١: الموقعون الرئيسيون</h4>
      <p>
        يُشار إلى الموقعين بصفتهما شركة Apex Technologies Group Inc. («العميل») وشركة Counselor
        Solutions LLC («المزود»). كل طرف يلتزم بنصوص هذا الاتفاق.
      </p>

      <h4 className="mt-6 text-xs font-bold uppercase text-brand">البند ٢: ضمانات عدم الإفصاح</h4>
      <p>
        يتعهد كل طرف بحماية الملفات السرية.{' '}
        <span
          onClick={() => onHighlight('cl-1')}
          className={`${mark} border-accent bg-accent/15 hover:bg-accent/25`}
        >
          الالتزام بالسرية المطلقة لجميع المعلومات الفنية والمالية لمدة خمس (٥) سنوات.
        </span>{' '}
        وتخضع الأسرار التجارية لحظر إفصاح دائم.
      </p>

      <h4 className="mt-6 text-xs font-bold uppercase text-brand">البند ٣: الملكية الفكرية</h4>
      <p>
        <span
          onClick={() => onHighlight('cl-2')}
          className={`${mark} border-success bg-success/15 hover:bg-success/25`}
        >
          جميع مخرجات العمل الفكرية والكود المصدري تعود ملكيتها الحصرية والكاملة للعميل.
        </span>
      </p>

      <h4 className="mt-6 text-xs font-bold uppercase text-brand">البند ٨: تسوية النزاعات</h4>
      <p>
        <span
          onClick={() => onHighlight('cl-3')}
          className={`${mark} border-accent bg-accent/15 hover:bg-accent/25`}
        >
          يخضع هذا الاتفاق لقوانين ولاية ديلاوير، وتكون لمحاكم ويلمنغتون الاختصاص الحصري.
        </span>
      </p>

      <h4 className="mt-6 text-xs font-bold uppercase text-brand">البند ٩: التعويض والمسؤولية</h4>
      <p>
        <span
          onClick={() => onHighlight('cl-4')}
          className={`${mark} border-danger bg-danger/15 hover:bg-danger/25`}
        >
          يوافق مزود الخدمة على تعويض العميل من أي مطالبات دون أي حدود أقصى للمسؤولية القانونية.
        </span>
      </p>
    </>
  );
}
