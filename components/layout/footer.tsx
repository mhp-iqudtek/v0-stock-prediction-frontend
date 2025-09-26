/**
 * Footer component with iquedtek branding and additional links
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">© 2025 Quant-Trade. All rights reserved.</div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">Powered by</span>
            <span className="font-semibold text-primary">iquedtek</span>
            <span className="text-muted-foreground">|</span>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              API Documentation
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
