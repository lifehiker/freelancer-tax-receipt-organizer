import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await prisma.taxProfile.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Update your tax profile and account settings</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Tax Profile</CardTitle><CardDescription>Update your filing status and income estimates for accurate quarterly calculations</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="font-medium text-slate-500">Filing Status</p><p className="text-slate-900">{profile?.filingStatus || "Not set"}</p></div>
              <div><p className="font-medium text-slate-500">State</p><p className="text-slate-900">{profile?.stateCode || "Not set"}</p></div>
              <div><p className="font-medium text-slate-500">Tax Year</p><p className="text-slate-900">{profile?.taxYear || 2024}</p></div>
            </div>
            <a href="/onboarding" className="inline-flex items-center justify-center rounded-md border border-teal-700 text-teal-700 px-4 py-2 text-sm font-medium hover:bg-teal-50 transition-colors">Update Tax Profile</a>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Account</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div><p className="font-medium text-slate-500 text-sm">Email</p><p className="text-slate-900">{session.user.email}</p></div>
            <div><p className="font-medium text-slate-500 text-sm">Name</p><p className="text-slate-900">{session.user.name || "Not set"}</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
