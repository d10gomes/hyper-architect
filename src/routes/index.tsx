import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import { Benefits } from "@/components/landing/Benefits";
import { UploadDemo } from "@/components/landing/UploadDemo";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Atelier AI — Renders fotorrealistas para arquitetos" },
      {
        name: "description",
        content:
          "Transforme projetos arquitetônicos em renders fotorrealistas com IA — mantendo fidelidade absoluta a cada centímetro do desenho original.",
      },
      { property: "og:title", content: "Atelier AI — Renders fotorrealistas para arquitetos" },
      {
        property: "og:description",
        content: "Envie planta, croqui ou modelo 3D e receba um render fotorrealista fiel ao projeto original.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <BeforeAfter />
        <Benefits />
        <UploadDemo />
        <FinalCTA />
      </main>
      <Footer />
      <Toaster position="bottom-center" />
    </div>
  );
}
