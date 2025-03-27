import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

import Logo from "@/app/Logo";

import { SubmitButton } from "./submit-button"
import { signinWithGithub, signinWithGoogle, signUpAction } from "@/app/actions"
import { FormMessage } from "@/app/(auth-pages)/components/auth-message"

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };


export function SignUpForm({ searchParams }: {
  searchParams: Message
}) {

  return (
    <div className="flex flex-col gap-6 w-full" >
      <Card>
        <CardHeader className="text-center flex items-center justify-center pt-5">
          <CardTitle>
            <Logo />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormMessage message={searchParams} />
          <form className="flex flex-col ">

            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <Label htmlFor="displayname">Display Name</Label>
              <Input name="displayname" placeholder="Your Name" required />
              <Label htmlFor="email">Email</Label>
              <Input name="email" type="" placeholder="you@example.com" required />
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="Your password"
                minLength={6}
                required
              />
              <SubmitButton formAction={signUpAction} pendingText="Signing up...">
                Sign up
              </SubmitButton>
            </div>
          </form>
          <p className="text-sm text-center pt-3 text text-foreground">
            Already have an account?{" "}
            <Link className="text-primary font-medium underline" href="/sign-in">
              Sign in
            </Link>
          </p>
          <div className="py-4 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={signinWithGoogle} variant="outline" className="w-full cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="#7F4A88"
                />
              </svg>
              <span className="sr-only">Login with Google</span>
            </Button>
            <Button onClick={signinWithGithub} variant="outline" className="w-full cursor-pointer">
              <svg className="text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#7F4A88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              <span className="sr-only">Login with Github</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
