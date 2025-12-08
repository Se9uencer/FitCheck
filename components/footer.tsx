import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-secondary/10">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <Link href="/" className="text-xl font-semibold text-foreground">
              FitCheck
            </Link>
            <p className="text-sm text-muted-foreground">Precision in fashion.</p>
          </div>

          <div className="flex flex-col md:items-end gap-4">
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 FitCheck. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
