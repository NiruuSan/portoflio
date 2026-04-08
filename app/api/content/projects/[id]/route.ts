import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { verifyAuth } from "@/lib/auth"
import { githubWriteFile, githubDeleteFile, githubFileExists } from "@/lib/github"

const projectsDir = path.join(process.cwd(), "content", "projects")

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await params
    const filePath = path.join(projectsDir, `${id}.json`)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    const json = fs.readFileSync(filePath, "utf-8")
    return NextResponse.json({ id, ...JSON.parse(json) })
  } catch (err) {
    return NextResponse.json({ error: "Failed to read project" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await params
    const project = await request.json()
    const ghPath = `content/projects/${id}.json`
    if (!(await githubFileExists(ghPath))) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    await githubWriteFile(ghPath, project, `Update project: ${id}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await params
    const ghPath = `content/projects/${id}.json`
    if (!(await githubFileExists(ghPath))) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    await githubDeleteFile(ghPath, `Delete project: ${id}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
