import { ControlPanel } from "./ControlPanel";
import { ResultPanel } from "./ResultPanel";

export function Workspace() {
  return (
    <section className="workspace section-shell" id="workspace" aria-label="Explanation workspace">
      <ControlPanel />
      <ResultPanel />
    </section>
  );
}
