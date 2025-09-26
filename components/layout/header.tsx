import { TrendingUp, BarChart3 } from "lucide-react"

/**
 * Header component for the Quant-Trade dashboard
 * Features the main navigation and branding
 */
export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Quant-Trade</h1>
                <p className="text-xs text-muted-foreground">Stock Prediction Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Dashboard
            </a>
            <a
              href="#analytics"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Analytics
            </a>
            <a
              href="#predictions"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Predictions
            </a>
          </nav>

          {/* Powered by iquedtek */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span>
              Powered by <span className="font-semibold text-primary">iquedtek</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
