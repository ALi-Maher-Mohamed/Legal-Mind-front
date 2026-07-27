import { redirect } from 'next/navigation';
import { CheckEmailPage } from '@/modules/auth';
import { ROUTES } from '@/config/routes';

type Props = {
  searchParams: Promise<{ email?: string | string[] }>;
};

function resolveEmail(raw: string | string[] | undefined): string | null {
  if (!raw) return null;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const email = resolveEmail(params.email);
  if (!email) redirect(ROUTES.login);
  return <CheckEmailPage email={email} />;
}
