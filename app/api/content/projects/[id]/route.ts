import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { verifyAuth } from "@/lib/auth"

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
    const filePath = path.join(projectsDir, `${id}.json`)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2), "utf-8")
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
    const filePath = path.join(projectsDir, `${id}.json`)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    fs.unlinkSync(filePath)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
