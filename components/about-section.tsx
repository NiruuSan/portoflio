"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const stats = [
  { value: "4+", label: "Years Experience" },
  { value: "6+", label: "Tools Mastered" },
]

export function AboutSection() {
  const ref = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(textRef, { once: true, margin: "-100px" })

  return (
    <section id="about" ref={ref} style={{ position: "relative" }} className="overflow-hidden px-6 py-32 md:px-12">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-20 flex flex-col gap-12 md:flex-row">
          {/* Left label */}
          <div className="md:w-1/3">
            <span className="text-xs tracking-[0.3em] text-accent uppercase">
              About
            </span>
          </div>

          {/* Main text */}
          <motion.div
            ref={textRef}
            className="md:w-2/3"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-2xl leading-relaxed text-foreground md:text-3xl">
              I craft{" "}
              <span className="text-accent">visual narratives</span> that move
              people. With 4+ years of hands-on experience across{" "}
              <span className="text-accent">After Effects, Unreal Engine, and beyond</span>,
              I transform ideas into cinematic motion.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              From logo animations and brand films to short-form social content
              and 3D real-time environments, I bring versatility and craft to
              every project. Every frame is an opportunity to tell a story.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-px border border-border bg-border">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-2 bg-background p-8 md:p-12"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <span className="font-mono text-3xl font-bold text-accent md:text-4xl">
                {stat.value}
              </span>
              <span className="text-center text-xs tracking-wider text-muted-foreground uppercase">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
