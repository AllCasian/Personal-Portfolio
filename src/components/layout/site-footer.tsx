export function SiteFooter() {
  return (
    <footer className="site-footer content-width">
      <a href="#home" className="footer-brand">
        YN<span> · Software Engineer</span>
      </a>
      <p>
        Personal portfolio foundation <span>© {new Date().getFullYear()}</span>
      </p>
    </footer>
  )
}
