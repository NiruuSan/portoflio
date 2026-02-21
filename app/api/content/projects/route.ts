import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { verifyAuth } from "@/lib/auth"

const projectsDir = path.join(process.cwd(), "content", "projects")

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function GET() {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".json"))
    const projects = files.map((file) => {
      const id = file.replace(".json", "")
      const json = fs.readFileSync(path.join(projectsDir, file), "utf-8")
      return { id, ...JSON.parse(json) }
    })
    return NextResponse.json(projects.sort((a, b) => Number(b.year) - Number(a.year)))
  } catch (err) {
    return NextResponse.json({ error: "Failed to read projects" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const project = await request.json()
    const id = slugify(project.title)
    const filePath = path.join(projectsDir, `${id}.json`)
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2), "utf-8")
    return NextResponse.json({ success: true, id })
  } catch (err) {
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 })
  }
}
