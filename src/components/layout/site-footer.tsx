export function SiteFooter() {
  return (
    <footer className="site-footer content-width">
      <a href="#home" className="footer-brand" aria-label="Portfolio home">
        Portfolio<span> · Software engineering</span>
      </a>
      <p>
        Personal portfolio foundation <span>© {new Date().getFullYear()}</span>
      </p>
    </footer>
  )
}
