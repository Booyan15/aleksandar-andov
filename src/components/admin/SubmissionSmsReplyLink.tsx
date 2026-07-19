import { MessageSquareText } from "lucide-react";
import { generateSubmissionSmsUrl, type SubmissionSmsData } from "@/lib/sms";

export function SubmissionSmsReplyLink({ submission }: { submission: SubmissionSmsData }) {
  const smsUrl = generateSubmissionSmsUrl(submission);

  if (!smsUrl) {
    return null;
  }

  return (
    <a
      href={smsUrl}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-municipal-line bg-white px-4 py-2 text-sm font-semibold text-municipal-text transition hover:bg-municipal-warm hover:text-municipal-red"
    >
      <MessageSquareText className="h-4 w-4" aria-hidden="true" />
      Врати преку SMS
    </a>
  );
}
