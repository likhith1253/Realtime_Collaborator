
import Navigation from '@/components/navigation'
import HeroSection from '@/components/hero-section'
import FeaturesSection from '@/components/features-section'
import CollaborationSection from '@/components/collaboration-section'
import DocsSection from '@/components/docs-section'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <CollaborationSection />
        <DocsSection />
      </main>
      <Footer />
    </div>
  )
}
