import { Suspense } from 'react';
import { PaymentSuccessPage } from '@/modules/payments';

export default function PaymentSuccessRoute() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessPage />
    </Suspense>
  );
}
