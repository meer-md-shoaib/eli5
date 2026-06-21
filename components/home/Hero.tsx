"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Sparkles, Shuffle, ArrowRight } from "lucide-react";
import { useExplainer } from "@/hooks/useExplainer";
import { useAtmosphere } from "@/hooks/useAtmosphere";
import { LANGUAGES, RANDOM_TOPICS } from "@/lib/constants";
import { RANDOM_TOPIC_LABEL, TOPIC_PLACEHOLDER_EXAMPLES } from "@/lib/copy";
import { Button } from "@/components/ui/Button";

/** Picks a random element from the array, avoiding the previous value. */
function pickDifferent(arr: readonly string[], prev: string): string {
  if (arr.length <= 1) return arr[0] ?? "";
  const others = arr.filter((s) => s !== prev);
  return others[Math.floor(Math.random() * others.length)]!;
}

export function Hero() {
  const {
    topicDraft, setTopicDraft,
    language, setLanguage,
    isBusy, submitTopic,
  } = useExplainer();

  const { setFromText } = useAtmosphere();
  const [isFocused, setIsFocused] = useState(false);

  // Initialise to a stable SSR value; rotate on the client only.
  const [placeholder, setPlaceholder] = useState<string>(TOPIC_PLACEHOLDER_EXAMPLES[0]!);
  const placeholderRef = useRef(placeholder);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Keep ref in sync with state (in an effect, never during render).
  useEffect(() => { placeholderRef.current = placeholder; }, [placeholder]);

  // Atmosphere reacts to topic text
  useEffect(() => { setFromText(topicDraft); }, [topicDraft, setFromText]);

  // Rotate placeholder text on the client only, avoiding SSR mismatch.
  // We use a ref-based callback so the interval closure never becomes stale.
  const rotatePlaceholder = useCallback(() => {
    if (!inputRef.current?.value && document.activeElement !== inputRef.current) {
      setPlaceholder((prev) => pickDifferent(TOPIC_PLACEHOLDER_EXAMPLES, prev));
    }
  }, []);

  useEffect(() => {
    // Pick a random one immediately after mount (client-only).
    const initial = pickDifferent(TOPIC_PLACEHOLDER_EXAMPLES, placeholderRef.current);
    const id = setTimeout(() => setPlaceholder(initial), 0);

    const interval = setInterval(rotatePlaceholder, 4200);
    return () => {
      clearTimeout(id);
      clearInterval(interval);
    };
  }, [rotatePlaceholder]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submitTopic(topicDraft);
  }

  function chooseRandomTopic() {
    const topic = RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)]!;
    setTopicDraft(topic);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 50);
  }

  const hasContent = topicDraft.length > 0;

  return (
    <section className="hero section-shell" id="top" aria-labelledby="hero-heading">
      {/* Badge */}
      <span className="hero-badge">
        <span className="badge-dot" aria-hidden="true" />
        AI explanations, your way
      </span>

      {/* Title block */}
      <div className="hero-title-block">
        <h1 className="hero-title" id="hero-heading">Explain</h1>
        <span className="hero-title-serif" aria-hidden="true">Like I&apos;m&nbsp;5</span>
        <p className="hero-subtitle">
          Feed it anything confusing. Get back something that actually makes sense.
        </p>
      </div>

      {/* Search panel */}
      <form
        className={`search-panel glass-card${hasContent ? " has-content" : ""}`}
        onSubmit={handleSubmit}
        aria-label="Ask for an explanation"
      >
        <label className="visually-hidden" htmlFor="topic-input">
          What would you like explained?
        </label>

        <div className={`hero-search${isFocused ? " is-focused" : ""}`}>
          <span className="search-spark" aria-hidden="true">
            <Sparkles size={17} />
          </span>
          <input
            ref={inputRef}
            id="topic-input"
            type="text"
            maxLength={180}
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder}
            value={topicDraft}
            onChange={(e) => setTopicDraft(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-label="Topic to explain"
          />
          <Button
            type="submit"
            icon={<ArrowRight size={15} />}
            disabled={isBusy || !topicDraft.trim()}
            aria-label={isBusy ? "Generating explanation" : "Explain this topic"}
          >
            {isBusy ? "Thinking…" : "Explain"}
          </Button>
        </div>

        <div className="quick-controls">

          <label className="field">
            <span>Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Response language"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </label>

          <Button
            variant="secondary"
            type="button"
            icon={<Shuffle size={13} />}
            iconPosition="leading"
            onClick={chooseRandomTopic}
            aria-label="Pick a random topic"
          >
            {RANDOM_TOPIC_LABEL}
          </Button>
        </div>
      </form>
    </section>
  );
}
