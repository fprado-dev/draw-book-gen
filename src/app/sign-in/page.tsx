'use client';

import { LoginForm } from "@/components/login-form";
export default function SignIn() {

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-xl">
        <LoginForm />
      </div>
    </div>
  );
}
