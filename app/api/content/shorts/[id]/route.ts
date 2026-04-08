import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { githubWriteFile, githubDeleteFile, githubFileExists } from "@/lib/github"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await params
    const short = await request.json()
    const ghPath = `content/shorts/${id}.json`
    if (!(await githubFileExists(ghPath))) {
      return NextResponse.json({ error: "Short not found" }, { status: 404 })
    }
    await githubWriteFile(ghPath, short, `Update short: ${id}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Failed to update short" }, { status: 500 })
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
    const ghPath = `content/shorts/${id}.json`
    if (!(await githubFileExists(ghPath))) {
      return NextResponse.json({ error: "Short not found" }, { status: 404 })
    }
    await githubDeleteFile(ghPath, `Delete short: ${id}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete short" }, { status: 500 })
  }
}
