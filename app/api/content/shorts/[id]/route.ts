import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { verifyAuth } from "@/lib/auth"

const shortsDir = path.join(process.cwd(), "content", "shorts")

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
    const filePath = path.join(shortsDir, `${id}.json`)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Short not found" }, { status: 404 })
    }
    fs.writeFileSync(filePath, JSON.stringify(short, null, 2), "utf-8")
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
    const filePath = path.join(shortsDir, `${id}.json`)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Short not found" }, { status: 404 })
    }
    fs.unlinkSync(filePath)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete short" }, { status: 500 })
  }
}
