import { VerifyEmailPage } from '@/modules/auth';

type Props = {
  searchParams: Promise<{ token?: string | string[] }>;
};

function resolveToken(raw: string | string[] | undefined): string | null {
  if (!raw) return null;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  return <VerifyEmailPage token={resolveToken(params.token)} />;
}
