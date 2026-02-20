"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function MagneticCursor() {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const [isHovering, setIsHovering] = useState(false)
  const [cursorLabel, setCursorLabel] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const rafRef = useRef<number>(0)

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 }
  const x = useSpring(cursorX, springConfig)
  const y = useSpring(cursorY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        cursorX.set(e.clientX)
        cursorY.set(e.clientY)
      })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const cursorEl = target.closest("[data-cursor]")
      if (cursorEl) {
        setIsHovering(true)
        setCursorLabel(cursorEl.getAttribute("data-cursor") || "")
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.relatedTarget as HTMLElement | null
      if (!target?.closest("[data-cursor]")) {
        setIsHovering(false)
        setCursorLabel("")
      }
    }

    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseover", handleMouseOver, { passive: true })
    document.addEventListener("mouseout", handleMouseOut, { passive: true })
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mouseout", handleMouseOut)
      document.removeEventListener("mouseleave", handleMouseLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [cursorX, cursorY, isVisible])

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
        style={{ x, y }}
      >
        <motion.div
          className="flex items-center justify-center rounded-full border border-accent"
          style={{ translateX: "-50%", translateY: "-50%" }}
          animate={{
            width: isHovering ? 80 : 12,
            height: isHovering ? 80 : 12,
            backgroundColor: isHovering
              ? "rgba(138, 80, 220, 0.15)"
              : "rgba(138, 80, 220, 0.8)",
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          {isHovering && cursorLabel && (
            <motion.span
              className="text-xs font-medium tracking-wider text-accent uppercase"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              {cursorLabel}
            </motion.span>
          )}
        </motion.div>
      </motion.div>
    </>
  )
}
