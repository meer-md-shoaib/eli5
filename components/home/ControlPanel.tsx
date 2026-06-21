import { Reveal } from "@/components/ui/Reveal";
import { ModeGrid } from "./ModeGrid";
import { ComplexitySlider } from "./ComplexitySlider";

export function ControlPanel() {
  return (
    <Reveal as="aside" className="control-panel glass-card">
      <div className="section-heading compact">
        <span className="eyebrow">Persona</span>
        <h2>Pick a voice.</h2>
      </div>
      <ModeGrid />
      <ComplexitySlider />
    </Reveal>
  );
}
