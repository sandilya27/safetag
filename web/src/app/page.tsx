import { ChatProvider } from "@/components/chat-context";
import { ChatWidget } from "@/components/chat-widget";
import { StoryProvider } from "@/components/home/story-context";
import { StoryStage } from "@/components/home/story-stage";
import { AssistantQuote, Calibration, Certifications, Hero, Industries, Labs, Projects, Services, TestimonialsSection } from "@/components/home/sections";
import { SiteHeader } from "@/components/site-header";
import { MobileQuoteBar, SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <ChatProvider>
      <SiteHeader />
      <main id="story" className="grid-paper relative">
        <StoryProvider>
          <StoryStage />
          <Hero />
          <Services />
          <Industries />
          <Labs />
          <Calibration />
          <Certifications />
        </StoryProvider>
      </main>
      <Projects />
      <TestimonialsSection />
      <AssistantQuote />
      <SiteFooter />
      <MobileQuoteBar />
      <ChatWidget />
    </ChatProvider>
  );
}
