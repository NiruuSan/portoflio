import fs from "fs"
import path from "path"

const contentDir = path.join(process.cwd(), "content")

export interface GlobalContent {
  hero: { name: string; tagline: string; subtitle: string }
  about: {
    heading: string
    description: string
    descriptionSecondary: string
    stats: { value: string; label: string }[]
  }
  contact: {
    heading: string
    description: string
    email: string
    socialLinks: { label: string; href: string }[]
  }
  marquee: { skills: string[] }
  metadata: { title: string; description: string }
}

export interface Project {
  title: string
  category: string
  year: string
  image: string
  videoId: string
  description: string
  isShort: boolean
}

export interface ShortProject {
  title: string
  videoId: string
  category: string
}

export async function getGlobalContent(): Promise<GlobalContent> {
  const filePath = path.join(contentDir, "global.json")
  const json = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(json)
}

export async function getProjects(): Promise<Project[]> {
  const dir = path.join(contentDir, "projects")
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"))
  const projects: Project[] = []
  for (const file of files) {
    const json = fs.readFileSync(path.join(dir, file), "utf-8")
    projects.push(JSON.parse(json))
  }
  return projects.sort((a, b) => Number(b.year) - Number(a.year))
}

export async function getShortProjects(): Promise<ShortProject[]> {
  const dir = path.join(contentDir, "shorts")
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"))
  const shorts: ShortProject[] = []
  for (const file of files) {
    const json = fs.readFileSync(path.join(dir, file), "utf-8")
    shorts.push(JSON.parse(json))
  }
  return shorts
}
