"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export function ContactSection({
  content,
}: {
  content: {
    heading: string
    description: string
    email: string
    socialLinks: { label: string; href: string }[]
  }
}) {
  const contactHeading = content.heading.split(" ")
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const lineRef = useRef<HTMLDivElement>(null)
  const lineInView = useInView(lineRef, { once: true })

  return (
    <section id="contact" ref={ref} className="relative px-6 py-32 md:px-12">
      <div className="mx-auto max-w-5xl text-center">
        {/* Animated divider */}
        <motion.div
          ref={lineRef}
          className="mx-auto mb-16 h-px bg-accent"
          initial={{ width: 0 }}
          animate={lineInView ? { width: "100%" } : {}}
          transition={{ duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
          style={{ maxWidth: "200px" }}
        />

        <span className="text-xs tracking-[0.3em] text-accent uppercase">
          Get in Touch
        </span>

        {/* Word-by-word stagger */}
        <h2 className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 font-mono text-4xl font-bold text-foreground md:text-6xl lg:text-7xl">
          {contactHeading.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: i * 0.08 + 0.2,
                duration: 0.6,
                ease: [0.215, 0.61, 0.355, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        <motion.p
          className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {content.description}
        </motion.p>

        <motion.a
          href={`mailto:${content.email}`}
          className="group relative mt-10 inline-flex items-center gap-3 overflow-hidden rounded-full border border-accent px-8 py-4 text-sm tracking-wider text-accent uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          data-cursor="Email"
        >
          <span className="relative z-10">{content.email}</span>
          <svg
            className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </motion.a>

        {/* Social links */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {content.socialLinks.map((platform) => (
            <a
              key={platform.label}
              href={platform.href}
              target={platform.href.startsWith("http") ? "_blank" : undefined}
              rel={platform.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-accent"
            >
              {platform.label}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
