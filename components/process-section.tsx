"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "Understanding your vision, audience, and goals through in-depth conversation and research.",
  },
  {
    number: "02",
    title: "Concept",
    description:
      "Translating strategy into visual direction with mood boards, style frames, and animatics.",
  },
  {
    number: "03",
    title: "Production",
    description:
      "Bringing concepts to life through animation, compositing, and meticulous craft.",
  },
  {
    number: "04",
    title: "Delivery",
    description:
      "Final renders, format adaptation, and handoff with comprehensive asset packages.",
  },
]

export function ProcessSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })

  return (
    <section id="process" className="px-6 py-32 md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={isHeaderInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs tracking-[0.3em] text-accent uppercase">
            How I Work
          </span>
          <h2 className="mt-2 font-mono text-4xl font-bold text-foreground md:text-6xl">
            Process
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="group flex flex-col gap-4 border-t border-border py-10 md:flex-row md:items-center md:gap-12 md:py-14"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: i * 0.1,
                duration: 0.6,
                ease: [0.215, 0.61, 0.355, 1],
              }}
            >
              <span className="font-mono text-sm text-accent">
                {step.number}
              </span>
              <h3 className="font-mono text-2xl font-bold text-foreground transition-colors group-hover:text-accent md:w-48 md:text-3xl">
                {step.title}
              </h3>
              <div className="relative flex-1">
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {step.description}
                </p>
                <motion.div
                  className="absolute -bottom-10 left-0 h-px bg-accent md:-bottom-14"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.15 + 0.3,
                    duration: 1,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  style={{ opacity: 0.15 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
