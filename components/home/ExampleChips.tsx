"use client";

import { EXAMPLE_TOPICS } from "@/lib/constants";
import { useExplainer } from "@/hooks/useExplainer";
import { Reveal } from "@/components/ui/Reveal";

export function ExampleChips() {
  const { setTopicDraft, submitTopic } = useExplainer();

  function handlePick(topic: string) {
    setTopicDraft(topic);
    submitTopic(topic);
    requestAnimationFrame(() => {
      document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <section
      className="section-shell"
      id="examples"
      aria-labelledby="examples-title"
      style={{ paddingTop: "1rem" }}
    >
      <Reveal className="section-heading">
        <span className="eyebrow">Explore topics</span>
        <h2 id="examples-title">Start with a spark.</h2>
      </Reveal>

      <Reveal className="chip-cloud" delay={80} aria-label="Topic suggestions — click to explain">
        {EXAMPLE_TOPICS.map((topic) => (
          <button
            key={topic}
            type="button"
            className="chip"
            onClick={() => handlePick(topic)}
            aria-label={`Explain ${topic}`}
          >
            {topic}
          </button>
        ))}
      </Reveal>
    </section>
  );
}
