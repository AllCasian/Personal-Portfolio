export function CaseStudySection({
  title,
  content,
}: {
  title: string
  content: string | readonly string[]
}) {
  if (typeof content === 'string') {
    return (
      <section className="case-study-section" data-motion-reveal>
        <h2>{title}</h2>
        <p>{content}</p>
      </section>
    )
  }

  if (!content.length) return null

  return (
    <section className="case-study-section" data-motion-reveal>
      <h2>{title}</h2>
      <ul>
        {content.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
