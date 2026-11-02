import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { SkipLink } from '@/components/layout/skip-link'
import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { SectionPlaceholder } from '@/components/sections/section-placeholder'
import { sections } from '@/content/sections'

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <div className="section-stack">
          {sections
            .filter((section) => section.state === 'placeholder')
            .map((section) => (
              <SectionPlaceholder key={section.id} section={section} />
            ))}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
