import 'server-only'
import type { ContactSourceRecord } from '@/content/contact-types'
import { ContactSection } from '@/components/sections/contact-section'
import { SiteFooter } from '@/components/layout/site-footer'
import { projectPublicContact } from '@/lib/contact-content'

export const dynamic = 'force-dynamic'

function readRecords(): Record<string, ContactSourceRecord> {
  const serialized = process.env.CONTACT_PUBLICATION_FIXTURE_RECORDS
  if (!serialized) throw new Error('Private publication fixture records are required at runtime')
  return JSON.parse(serialized) as Record<string, ContactSourceRecord>
}

export default function PublicationBoundaryFixture() {
  const records = readRecords()

  return (
    <main>
      <h1>Publication boundary fixture</h1>
      {Object.entries(records).map(([caseName, record]) => {
        const profile = projectPublicContact(record)
        return (
          <div key={caseName} data-fixture-case={caseName}>
            <ContactSection profile={profile} />
            <SiteFooter ownerName={profile.ownerName} />
          </div>
        )
      })}
    </main>
  )
}
