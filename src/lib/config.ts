export const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

// Optional NOWPayments subscription URLs (set in your env for each plan)
export const nowpaymentsPlusUrl =
  process.env.NEXT_PUBLIC_NOWPAYMENTS_PLUS_URL || "";
export const nowpaymentsProUrl =
  process.env.NEXT_PUBLIC_NOWPAYMENTS_PRO_URL || "";
