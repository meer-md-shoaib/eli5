import { Hero } from "@/components/home/Hero";
import { ExampleChips } from "@/components/home/ExampleChips";
import { Workspace } from "@/components/home/Workspace";
import { HistorySection } from "@/components/home/HistorySection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ExampleChips />
      <Workspace />
      <HistorySection />
    </main>
  );
}
