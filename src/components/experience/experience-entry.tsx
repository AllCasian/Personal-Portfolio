import { Card } from '@/components/ui/card'
import type { MonthYear, PublishedExperience } from '@/content/experience-education-skills-types'

function formatMonthYear(date: MonthYear): string {
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(date.year, date.month - 1, 1)),
  )
}

export function ExperienceEntry({ entry }: { entry: PublishedExperience }) {
  return (
    <Card className="professional-entry">
      <div className="professional-entry-heading">
        <div>
          <h3>{entry.role}</h3>
          <p className="professional-organization">{entry.organization}</p>
        </div>
        <p className="professional-period">
          <time
            dateTime={`${entry.startDate.year}-${String(entry.startDate.month).padStart(2, '0')}`}
          >
            {formatMonthYear(entry.startDate)}
          </time>
          {' – '}
          <time dateTime={`${entry.endDate.year}-${String(entry.endDate.month).padStart(2, '0')}`}>
            {formatMonthYear(entry.endDate)}
          </time>
        </p>
      </div>
      <dl className="professional-facts">
        {entry.program ? (
          <div>
            <dt>Program</dt>
            <dd>{entry.program}</dd>
          </div>
        ) : null}
        <div>
          <dt>Status</dt>
          <dd>{entry.status === 'former' ? 'Former' : 'Internship'}</dd>
        </div>
        {entry.location ? (
          <div>
            <dt>{entry.location === 'Remote' ? 'Work arrangement' : 'Location'}</dt>
            <dd>{entry.location}</dd>
          </div>
        ) : null}
      </dl>
      {entry.contributions.length > 0 ? (
        <ul className="professional-contributions">
          {entry.contributions.map((contribution) => (
            <li key={contribution}>{contribution}</li>
          ))}
        </ul>
      ) : null}
    </Card>
  )
}
