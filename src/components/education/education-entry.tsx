import { Card } from '@/components/ui/card'
import type { MonthYear, PublishedEducation } from '@/content/experience-education-skills-types'

function formatMonthYear(date: MonthYear): string {
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(date.year, date.month - 1, 1)),
  )
}

export function EducationEntry({ entry }: { entry: PublishedEducation }) {
  const period =
    entry.startDate && entry.endDate
      ? `${formatMonthYear(entry.startDate)} – ${formatMonthYear(entry.endDate)}`
      : undefined

  return (
    <Card className="education-entry">
      <h3>{entry.institution}</h3>
      {entry.qualification ? (
        <p className="education-qualification">{entry.qualification}</p>
      ) : null}
      <p>{entry.fieldOfStudy}</p>
      <p className="education-facts">
        {period ? <span>{period}</span> : null}
        <span>{entry.completionStatus === 'graduated' ? 'Graduated' : null}</span>
        {entry.location ? <span>{entry.location}</span> : null}
      </p>
    </Card>
  )
}
