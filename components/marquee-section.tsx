"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const skills = [
  "After Effects",
  "Unreal Engine",
  "Motion Design",
  "3D Animation",
  "Logo Animation",
  "Short Film",
  "Video Editing",
  "Social Content",
]

function MarqueeRow({
  items,
  direction,
}: {
  items: string[]
  direction: "left" | "right"
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "left" ? [100, -200] : [-200, 100]
  )

  const doubled = [...items, ...items, ...items]

  return (
    <div ref={ref} style={{ position: "relative" }} className="overflow-hidden whitespace-nowrap py-4">
      <motion.div className="flex gap-6" style={{ x }}>
        {doubled.map((item, i) => (
          <div key={i} className="flex shrink-0 items-center gap-6">
            <span
              className="font-mono text-[clamp(2rem,5vw,4.5rem)] font-bold uppercase"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.25)", color: "transparent" }}
            >
              {item}
            </span>
            <span className="text-accent">{"///"}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function MarqueeSection() {
  return (
    <section className="relative overflow-hidden border-y border-border/50 py-6">
      <MarqueeRow items={skills} direction="left" />
      <MarqueeRow items={[...skills].reverse()} direction="right" />
    </section>
  )
}
