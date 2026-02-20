"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function ReelSection() {
  const ref = useRef<HTMLElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const { scrollYProgress } = useScroll()

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  return (
    <section
      ref={ref}
      style={{ position: "relative" }}
      className="flex items-center justify-center overflow-hidden py-40"
    >
      {/* Background accent line */}
      <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-border" />

      {isPlaying ? (
        <motion.div
          className="relative z-10 w-full max-w-4xl overflow-hidden rounded-lg px-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-secondary">
            <iframe
              src="https://www.youtube.com/embed/3Zi4yo67Ahk?autoplay=1&controls=1"
              title="Neil Bissaud - Showreel"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <button
            onClick={() => setIsPlaying(false)}
            className="mx-auto mt-6 flex items-center gap-2 text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-accent"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </button>
        </motion.div>
      ) : (
        <motion.button
          className="relative flex cursor-pointer items-center justify-center"
          style={{ scale }}
          data-cursor="Play"
          onClick={() => setIsPlaying(true)}
          aria-label="Play showreel"
        >
          {/* Spinning ring */}
          <motion.svg
            className="absolute h-48 w-48 md:h-64 md:w-64"
            viewBox="0 0 200 200"
            style={{ rotate }}
          >
            <circle
              cx="100"
              cy="100"
              r="95"
              fill="none"
              stroke="#8a50dc"
              strokeWidth="0.5"
              strokeDasharray="6 6"
              style={{ animation: "dash-rotate 20s linear infinite" }}
            />
          </motion.svg>

          {/* Inner circle with text */}
          <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border border-border bg-background transition-colors duration-300 hover:border-accent md:h-48 md:w-48">
            <svg
              className="mb-2 h-6 w-6 text-accent md:h-8 md:w-8"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="font-mono text-xs tracking-[0.3em] text-foreground uppercase">
              Showreel
            </span>
            <span className="mt-1 text-[10px] text-muted-foreground">
              2026
            </span>
          </div>
        </motion.button>
      )}
    </section>
  )
}
