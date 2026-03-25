import { verifyEmail } from "@/app/actions/authActions";
import VerifyEmailResultCard from "./VerifyEmailResultCard";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;

  const token = Array.isArray(params.token)
    ? params.token[0]
    : params.token;

  const result = await verifyEmail(
    token
  );

  return <VerifyEmailResultCard result={result} />;
}