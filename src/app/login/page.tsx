"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  async function onLogin(data: LoginData) {
    setLoginLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        toast({ title: "Sign in failed", description: "Invalid email or password.", variant: "destructive" });
      } else {
        router.push("/dashboard");
      }
    } finally {
      setLoginLoading(false);
    }
  }

  async function onRegister(data: RegisterData) {
    setRegisterLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast({ title: "Registration failed", description: err.error || "Something went wrong.", variant: "destructive" });
        return;
      }
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (signInResult?.error) {
        toast({ title: "Account created", description: "Please sign in with your new account." });
      } else {
        router.push("/onboarding");
      }
    } finally {
      setRegisterLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-teal-700">FreelanceTaxKit</Link>
          <p className="text-slate-600 mt-2">1099 tax estimates and receipt organizer</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="signin">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="signin" className="flex-1">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="flex-1">Create Account</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="you@example.com" {...loginForm.register("email")} />
                    {loginForm.formState.errors.email && <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" placeholder="Enter your password" {...loginForm.register("password")} />
                    {loginForm.formState.errors.password && <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={loginLoading}>{loginLoading ? "Signing in..." : "Sign In"}</Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input placeholder="Your name" {...registerForm.register("name")} />
                    {registerForm.formState.errors.name && <p className="text-sm text-red-500">{registerForm.formState.errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="you@example.com" {...registerForm.register("email")} />
                    {registerForm.formState.errors.email && <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" placeholder="Choose a password" {...registerForm.register("password")} />
                    {registerForm.formState.errors.password && <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input type="password" placeholder="Confirm your password" {...registerForm.register("confirmPassword")} />
                    {registerForm.formState.errors.confirmPassword && <p className="text-sm text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={registerLoading}>{registerLoading ? "Creating account..." : "Create Free Account"}</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-slate-500 mt-4">
          By creating an account, you agree to our terms. FreelanceTaxKit provides estimates for informational purposes only, not tax advice.
        </p>
      </div>
    </div>
  );
}
