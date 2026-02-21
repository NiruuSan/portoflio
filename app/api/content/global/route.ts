import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { verifyAuth } from "@/lib/auth"

const contentPath = path.join(process.cwd(), "content", "global.json")

export async function GET() {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const json = fs.readFileSync(contentPath, "utf-8")
    return NextResponse.json(JSON.parse(json))
  } catch (err) {
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await request.json()
    fs.writeFileSync(contentPath, JSON.stringify(body, null, 2), "utf-8")
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
