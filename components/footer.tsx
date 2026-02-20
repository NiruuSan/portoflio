"use client"

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Neil Bissaud
        </span>
        <span className="text-xs text-muted-foreground">
          {"Designed with intention. Built with precision."}
        </span>
        <span className="text-xs text-muted-foreground">
          {"2026"}
        </span>
      </div>
    </footer>
  )
}
