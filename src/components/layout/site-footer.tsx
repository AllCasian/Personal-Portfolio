import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="site-footer content-width">
      <Link href="#home" className="footer-brand">
        YN<span> · Software Engineer</span>
      </Link>
      <p>
        Personal portfolio foundation <span>© {new Date().getFullYear()}</span>
      </p>
    </footer>
  )
}
