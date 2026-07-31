import { Suspense } from 'react';
import { DashboardPage } from '@/modules/dashboard';
import BrandSplash from '@/components/common/BrandSplash';

export default function Page() {
  return (
    <Suspense fallback={<BrandSplash />}>
      <DashboardPage />
    </Suspense>
  );
}
