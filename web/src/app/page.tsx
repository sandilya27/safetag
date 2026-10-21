import { StoryProvider } from "@/components/home/story-context";
import { StoryStage } from "@/components/home/story-stage";
import { AssistantQuote, Calibration, Certifications, Hero, Industries, Labs, Projects, Services, TestimonialsSection } from "@/components/home/sections";

export default function Home() {
  return (
    <main id="content">
      {/* The story container: the stage stays stuck until it ends after Certifications. */}
      <div id="story" className="grid-paper relative">
        <StoryProvider>
          <StoryStage />
          <Hero />
          <Services />
          <Industries />
          <Labs />
          <Calibration />
          <Certifications />
        </StoryProvider>
      </div>
      <Projects />
      <TestimonialsSection />
      <AssistantQuote />
    </main>
  );
}
