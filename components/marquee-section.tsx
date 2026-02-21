"use client"

function MarqueeRow({
  items,
  direction,
}: {
  items: string[]
  direction: "left" | "right"
}) {
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden whitespace-nowrap py-4">
      <div
        className="marquee-row flex w-max gap-6"
        style={{
          animation: `marquee-${direction} 50s linear infinite`,
        }}
      >
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
      </div>
    </div>
  )
}

export function MarqueeSection({ skills }: { skills: string[] }) {
  return (
    <section className="relative overflow-hidden border-y border-border/50 py-6">
      <MarqueeRow items={skills} direction="left" />
      <MarqueeRow items={[...skills].reverse()} direction="right" />
    </section>
  )
}
