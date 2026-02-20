"use client"

import { motion, useScroll, useTransform } from "framer-motion"

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
]

export function Navigation() {
  const { scrollYProgress } = useScroll()
  const navOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1])
  const navY = useTransform(scrollYProgress, [0, 0.05], [-20, 0])

  return (
    <motion.nav
      className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-5 md:px-12"
      style={{ opacity: navOpacity, y: navY }}
    >
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl" />

      <a
        href="#"
        className="relative z-10 font-mono text-sm font-bold tracking-widest text-foreground uppercase"
      >
        NB.
      </a>

      <div className="relative z-10 hidden items-center gap-8 md:flex">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
      </div>

      <a
        href="#contact"
        className="relative z-10 rounded-full border border-border px-4 py-2 text-xs text-foreground uppercase tracking-wider transition-colors hover:border-accent hover:text-accent"
        data-cursor="Say hi"
      >
        Let{"'"}s Talk
      </a>
    </motion.nav>
  )
}
