'use client';

import { SignUpForm } from "@/components/signup-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
export default function SignUp() {

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-xl">
          <SignUpForm />
        </div>
      </div>
    </QueryClientProvider>
  );
}
