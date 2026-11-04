export function ProjectTechnologyList({ technologies }: { technologies?: readonly string[] }) {
  if (!technologies?.length) return null

  return (
    <ul className="project-tags" aria-label="Technologies and concepts">
      {technologies.map((technology) => (
        <li key={technology}>{technology}</li>
      ))}
    </ul>
  )
}
