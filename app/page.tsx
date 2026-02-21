import { MagneticCursor } from "@/components/magnetic-cursor"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { MarqueeSection } from "@/components/marquee-section"
import { ProjectsSection } from "@/components/projects-section"
import { AboutSection } from "@/components/about-section"
import { ProcessSection } from "@/components/process-section"
import { ReelSection } from "@/components/reel-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { getGlobalContent, getProjects, getShortProjects } from "@/lib/content"

export default async function Page() {
  const [globalContent, projects, shortProjects] = await Promise.all([
    getGlobalContent(),
    getProjects(),
    getShortProjects(),
  ])

  return (
    <main className="relative min-h-screen cursor-none text-foreground md:cursor-none">
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.95 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0.95 0 0) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <MagneticCursor />
      <Navigation />
      <HeroSection content={globalContent.hero} />
      <MarqueeSection skills={globalContent.marquee.skills} />
      <ReelSection />
      <ProjectsSection projects={projects} shortProjects={shortProjects} />
      <AboutSection content={globalContent.about} />
      <ProcessSection />
      <ContactSection content={globalContent.contact} />
      <Footer />
    </main>
  )
}
