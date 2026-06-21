import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { ThinkingIndicator } from "./ThinkingIndicator";
import type { AsyncStatus } from "@/hooks/useExplainer";
import type { FollowUp } from "@/lib/types";

interface FollowUpEntriesProps {
  followUps: FollowUp[];
  followUpStatus: AsyncStatus;
  liveQuestion: string;
  liveAnswer: string;
  liveMessage: string;
}

export function FollowUpEntries({
  followUps,
  followUpStatus,
  liveQuestion,
  liveAnswer,
  liveMessage,
}: FollowUpEntriesProps) {
  const isLive = followUpStatus === "thinking" || followUpStatus === "streaming";

  return (
    <>
      {followUps.map((item) => (
        <section className="follow-up-entry" key={item.id}>
          <div className="follow-up-question">{item.question}</div>
          <MarkdownRenderer content={item.answer} />
        </section>
      ))}

      {isLive && (
        <section className="follow-up-entry follow-up-entry-live">
          <div className="follow-up-question">{liveQuestion}</div>
          {followUpStatus === "thinking" ? (
            <ThinkingIndicator message={liveMessage} compact />
          ) : (
            <MarkdownRenderer content={liveAnswer} />
          )}
        </section>
      )}
    </>
  );
}
