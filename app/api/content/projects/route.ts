import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { verifyAuth } from "@/lib/auth"
import { githubWriteFile } from "@/lib/github"

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
    await githubWriteFile(`content/projects/${id}.json`, project, `Add project: ${project.title}`)
    return NextResponse.json({ success: true, id })
  } catch (err) {
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 })
  }
}
