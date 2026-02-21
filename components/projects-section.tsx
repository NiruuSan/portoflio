"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"

const projects = [
  {
    title: "Unreal Engine 3D",
    category: "3D / Real-Time",
    year: "2025",
    image: "/images/project-1.jpg",
    videoId: "u3t-p3PoKxA",
    description:
      "Immersive 3D environment built in Unreal Engine. 5 days school project.",
    isShort: false,
  },
  {
    title: "42 2026 Wishcard",
    category: "After Effects",
    year: "2025",
    image: "/images/project-2.jpg",
    videoId: "2_C_abdWgTg",
    description:
      "Intro for a 2 minute Wishcard animation. This project was then discontinued.",
    isShort: false,
  },
  {
    title: "42 2025 Recap",
    category: "After Effects",
    year: "2025",
    image: "/images/project-3.jpg",
    videoId: "nRfecDuItQw",
    description:
      "A recap of 42's 2025 year in statistics through motion design and 3D.",
    isShort: false,
  },
  {
    title: "42 Logo Animation",
    category: "After Effects / Branding",
    year: "2025",
    image: "/images/project-4.jpg",
    videoId: "XORIXUNWavM",
    description:
      "Latest 42 logo animation in motion design.",
    isShort: false,
  },
  {
    title: "Fake Trailer",
    category: "Short Film",
    year: "2024",
    image: "/images/project-5.jpg",
    videoId: "SDwz8tQog50",
    description:
      "Cinematic fake trailer for the game Lethal Company made for a school project.",
    isShort: false,
  },
  {
    title: "6 Invitationals",
    category: "Short Content / Edit",
    year: "2026",
    image: "/images/project-6.jpg",
    videoId: "eso05llDzW0",
    description:
      "TikTok styled edit for Adidas Arena.",
    isShort: true,
  },
]

const shortProjects = [
  {
    title: "Fake TCG App",
    videoId: "tfQI4J-i-EY",
    category: "Animation",
  },
  {
    title: "Instagram Reel I",
    videoId: "r3QoufEWX0o",
    category: "Social Content",
  },
  {
    title: "Instagram Reel II",
    videoId: "2_4HJufjD6Q",
    category: "Social Content",
  },
  {
    title: "TikTok Short",
    videoId: "PgXdU2Kk-vE",
    category: "Short Content",
  },
]

function VideoEmbed({
  videoId,
  title,
  isShort,
}: {
  videoId: string
  title: string
  isShort: boolean
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const wasInView = useRef(false)
  const isInView = useInView(containerRef, { amount: 0.5, once: false })

  useEffect(() => {
    if (isPlaying) {
      if (wasInView.current && !isInView) {
        setIsPlaying(false)
      }
      wasInView.current = isInView
    } else {
      wasInView.current = false
    }
  }, [isPlaying, isInView])

  const baseUrl = isShort
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=1`
    : `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`

  if (!isPlaying) {
    return (
      <div ref={containerRef} className="absolute inset-0">
        <button
          onClick={() => setIsPlaying(true)}
          className="group/play flex h-full w-full cursor-pointer items-center justify-center"
          aria-label={`Play ${title}`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/50 bg-background/60 backdrop-blur-sm transition-all duration-300 group-hover/play:scale-110 group-hover/play:border-accent group-hover/play:bg-accent/20">
            <svg
              className="ml-1 h-5 w-5 text-accent"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="absolute inset-0">
      <iframe
        src={baseUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  )
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll()

  const imageY = useTransform(scrollYProgress, [0, 1], [-30, 30])
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      style={{ position: "relative" }}
      className={`flex flex-col gap-8 md:flex-row md:items-center ${
        isEven ? "" : "md:flex-row-reverse"
      }`}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.215, 0.61, 0.355, 1] }}
    >
      {/* Video / Image */}
      <div
        className={`group relative w-full overflow-hidden rounded-lg bg-secondary md:w-3/5 ${
          project.isShort ? "aspect-[9/16] max-h-[500px]" : "aspect-video"
        }`}
        data-cursor="Play"
      >
        <motion.div
          className="absolute inset-0"
          style={{ y: imageY, scale: 1.05 }}
        >
          <Image
            src={`https://img.youtube.com/vi/${project.videoId}/maxresdefault.jpg`}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
            unoptimized
          />
        </motion.div>
        <div className="absolute inset-0 bg-background/30 transition-opacity duration-500 group-hover:bg-background/10" />
        <VideoEmbed
          videoId={project.videoId}
          title={project.title}
          isShort={project.isShort}
        />
      </div>

      {/* Info */}
      <div
        className={`flex flex-col gap-4 md:w-2/5 ${isEven ? "md:pl-12" : "md:pr-12"}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs tracking-[0.3em] text-accent uppercase">
            {project.category}
          </span>
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">{project.year}</span>
        </div>
        <h3 className="font-mono text-4xl font-bold text-foreground md:text-5xl">
          {project.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        <a
          href={`https://youtu.be/${project.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link mt-2 flex items-center gap-2 text-xs tracking-wider text-foreground uppercase transition-colors hover:text-accent"
          data-cursor="YouTube"
        >
          Watch on YouTube
          <svg
            className="h-3 w-3 transition-transform group-hover/link:translate-x-1"
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
        </a>
      </div>
    </motion.div>
  )
}

export function ProjectsSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })
  const shortsRef = useRef<HTMLDivElement>(null)
  const shortsInView = useInView(shortsRef, { once: true, margin: "-100px" })

  return (
    <section id="work" className="relative px-6 py-32 md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          className="mb-20 flex items-end justify-between"
          initial={{ opacity: 0 }}
          animate={isHeaderInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="text-xs tracking-[0.3em] text-accent uppercase">
              Selected Work
            </span>
            <h2 className="mt-2 font-mono text-4xl font-bold text-foreground md:text-6xl">
              Projects
            </h2>
          </div>
          <span className="hidden text-sm text-muted-foreground md:block">
            {"(10)"}
          </span>
        </motion.div>

        {/* Featured project grid */}
        <div className="flex flex-col gap-24 md:gap-32">
          {[...projects]
            .sort((a, b) => Number(b.year) - Number(a.year))
            .map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
        </div>

        {/* Short-form section */}
        <motion.div
          ref={shortsRef}
          className="mt-32"
          initial={{ opacity: 0, y: 40 }}
          animate={shortsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-12">
            <span className="text-xs tracking-[0.3em] text-accent uppercase">
              Short-Form
            </span>
            <h3 className="mt-2 font-mono text-2xl font-bold text-foreground md:text-4xl">
              Reels & Shorts
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {shortProjects.map((short, i) => (
              <ShortCard key={short.videoId} short={short} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ShortCard({
  short,
  index,
}: {
  short: (typeof shortProjects)[0]
  index: number
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const wasInView = useRef(false)
  const isInView = useInView(containerRef, { amount: 0.5, once: false })

  useEffect(() => {
    if (isPlaying) {
      if (wasInView.current && !isInView) {
        setIsPlaying(false)
      }
      wasInView.current = isInView
    } else {
      wasInView.current = false
    }
  }, [isPlaying, isInView])

  return (
    <motion.div
      ref={containerRef}
      className="group relative aspect-[9/16] overflow-hidden rounded-lg bg-secondary"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      data-cursor="Play"
    >
      {!isPlaying ? (
        <>
          {/* YouTube thumbnail */}
          <Image
            src={`https://img.youtube.com/vi/${short.videoId}/hqdefault.jpg`}
            alt={short.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/20">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-background/50 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:border-accent">
              <svg
                className="ml-0.5 h-4 w-4 text-accent"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="px-3 text-center font-mono text-xs font-bold text-foreground drop-shadow-sm">
              {short.title}
            </span>
            <span className="mt-1 text-[10px] text-muted-foreground drop-shadow-sm">
              {short.category}
            </span>
          </div>
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 cursor-pointer"
            aria-label={`Play ${short.title}`}
          />
        </>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${short.videoId}?autoplay=1&loop=1&playlist=${short.videoId}&controls=1`}
          title={short.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      )}
    </motion.div>
  )
}
