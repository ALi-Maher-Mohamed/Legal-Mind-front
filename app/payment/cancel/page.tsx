import { Suspense } from 'react';
import { PaymentCancelPage } from '@/modules/payments';

export default function PaymentCancelRoute() {
  return (
    <Suspense fallback={null}>
      <PaymentCancelPage />
    </Suspense>
  );
}
