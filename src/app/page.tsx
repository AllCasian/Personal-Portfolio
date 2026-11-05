import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { SkipLink } from '@/components/layout/skip-link'
import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { SectionPlaceholder } from '@/components/sections/section-placeholder'
import { ProjectsSection } from '@/components/sections/projects-section'
import { sections } from '@/content/sections'
import { ExperienceSection } from '@/components/sections/experience-section'
import { EducationSection } from '@/components/sections/education-section'
import { SkillsSection } from '@/components/sections/skills-section'
import { ContactSection } from '@/components/sections/contact-section'
import { getPublishedProfessionalContent } from '@/lib/professional-content'
import { getPublishedContactProfile } from '@/lib/contact-content'

export default function HomePage() {
  const professionalContent = getPublishedProfessionalContent()
  const contactProfile = getPublishedContactProfile()

  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main-content">
        <HeroSection contactProfile={contactProfile} />
        <AboutSection />
        <div className="section-stack">
          {sections
            .filter((section) => !['home', 'about'].includes(section.id))
            .map((section) =>
              section.id === 'portfolio' ? (
                <ProjectsSection key={section.id} />
              ) : section.id === 'experience' ? (
                <ExperienceSection entries={professionalContent.experience} key={section.id} />
              ) : section.id === 'education' ? (
                <EducationSection
                  certifications={professionalContent.certifications}
                  entries={professionalContent.education}
                  key={section.id}
                />
              ) : section.id === 'skills' ? (
                <SkillsSection categories={professionalContent.skillCategories} key={section.id} />
              ) : section.id === 'contact' ? (
                <ContactSection profile={contactProfile} key={section.id} />
              ) : (
                <SectionPlaceholder key={section.id} section={section} />
              ),
            )}
        </div>
      </main>
      <SiteFooter ownerName={contactProfile.ownerName} />
    </>
  )
}
