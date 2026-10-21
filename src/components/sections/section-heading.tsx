type SectionHeadingProps = { eyebrow?: string; children: string; id?: string }

export function SectionHeading({ eyebrow, children, id }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 id={id} tabIndex={-1}>
        {children}
      </h2>
    </div>
  )
}
