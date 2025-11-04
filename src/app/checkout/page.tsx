import CheckoutClient from "./CheckoutClient";
export const dynamic = 'force-dynamic';

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const rawPlan = Array.isArray(sp?.plan) ? sp?.plan?.[0] : sp?.plan;
  const plan = rawPlan === "plus" || rawPlan === "pro" ? (rawPlan as "plus" | "pro") : null;
  return <CheckoutClient initialPlan={plan} />;
}
