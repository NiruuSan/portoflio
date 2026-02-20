"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const nameLetters = "NEIL BISSAUD".split("")

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 300])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.9])
  const letterSpacing = useTransform(scrollYProgress, [0, 0.5], [0, 40])

  return (
    <section
      ref={ref}
      style={{ position: "relative" }}
      className="flex min-h-screen items-center justify-center overflow-hidden"
    >
      <motion.div
        className="relative z-10 flex flex-col items-center px-6 text-center"
        style={{ y, opacity, scale }}
      >
        {/* Available tag */}
        <motion.div
          className="mb-8 flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
            Available for projects
          </span>
        </motion.div>

        {/* Main name */}
        <div className="overflow-hidden">
          <motion.h1
            className="flex flex-wrap justify-center font-mono text-[clamp(3rem,12vw,10rem)] font-bold leading-[0.9] text-foreground"
            style={{ letterSpacing }}
          >
            {nameLetters.map((letter, i) => (
              <motion.span
                key={i}
                className={letter === " " ? "w-[0.3em]" : "inline-block"}
                initial={{ y: 120, rotateX: -90, opacity: 0 }}
                animate={{ y: 0, rotateX: 0, opacity: 1 }}
                transition={{
                  delay: 0.05 * i + 0.2,
                  duration: 0.8,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                style={{ perspective: "600px" }}
              >
                {letter === " " ? null : letter}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          Motion Designer / After Effects / Unreal Engine
        </motion.p>

      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
          Scroll
        </span>
        <motion.div
          className="h-10 w-px bg-accent/50"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  )
}
