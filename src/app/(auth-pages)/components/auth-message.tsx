import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <>
      {"success" in message && (
        <Alert >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {message.success}
          </AlertTitle>
        </Alert>
      )}
      {"error" in message && (
        <Alert variant="destructive" >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {message.error}
          </AlertTitle>
        </Alert>

      )}
      {"message" in message && (
        <Alert >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {message.message}
          </AlertTitle>
        </Alert>
      )}
    </>
  );
}

