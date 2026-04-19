export async function sendQuarterlyReminder(params: {
  email: string;
  name: string;
  quarter: number;
  dueDate: string;
  quarterlyPayment: number;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[email] RESEND_API_KEY not set, skipping quarterly reminder");
    return { ok: true, skipped: true };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.EMAIL_FROM || "noreply@freelancetaxkit.com";

  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(params.quarterlyPayment);

  const result = await resend.emails.send({
    from,
    to: params.email,
    subject: `Q${params.quarter} Estimated Tax Reminder - Due ${params.dueDate}`,
    html: `
      <h2>Quarterly Tax Payment Reminder</h2>
      <p>Hi ${params.name || "there"},</p>
      <p>Your Q${params.quarter} estimated tax payment of approximately <strong>${amount}</strong> is due on <strong>${params.dueDate}</strong>.</p>
      <p>Log in to FreelanceTaxKit to review your current estimate and export your records.</p>
      <p>Remember: this is an estimate. Consult a tax professional for personalized advice.</p>
    `,
  });

  return result;
}
