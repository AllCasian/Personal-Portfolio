type SectionHeadingProps = {
  eyebrow?: string
  children: string
  id?: string
  motionReveal?: boolean
}

export function SectionHeading({
  eyebrow,
  children,
  id,
  motionReveal = false,
}: SectionHeadingProps) {
  return (
    <div className="section-heading" data-motion-reveal={motionReveal ? '' : undefined}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 id={id} tabIndex={-1}>
        {children}
      </h2>
    </div>
  )
}
