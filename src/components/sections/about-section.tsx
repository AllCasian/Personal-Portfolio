import { profile } from '@/content/profile'
import { Card } from '@/components/ui/card'
import { SectionHeading } from '@/components/sections/section-heading'

const topicLabels = {
  education: 'Education',
  experience: 'Professional background',
  interests: 'Engineering interests',
  competencies: 'Technical perspective',
  approach: 'How I work',
  direction: 'Professional direction',
} as const

export function AboutSection() {
  return (
    <section className="about-section content-width" id="about" aria-labelledby="about-title">
      <SectionHeading eyebrow="Background & approach" id="about-title">
        About
      </SectionHeading>
      <div className="about-topics">
        {Object.entries(topicLabels).map(([key, label]) => (
          <Card className="about-topic" key={key}>
            <h3>{label}</h3>
            <p>{profile.aboutSummary[key as keyof typeof profile.aboutSummary]}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
