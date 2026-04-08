import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { verifyAuth } from "@/lib/auth"
import { githubWriteFile } from "@/lib/github"

const shortsDir = path.join(process.cwd(), "content", "shorts")

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
    const files = fs.readdirSync(shortsDir).filter((f) => f.endsWith(".json"))
    const shorts = files.map((file) => {
      const id = file.replace(".json", "")
      const json = fs.readFileSync(path.join(shortsDir, file), "utf-8")
      return { id, ...JSON.parse(json) }
    })
    return NextResponse.json(shorts)
  } catch (err) {
    return NextResponse.json({ error: "Failed to read shorts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const short = await request.json()
    const id = slugify(short.title)
    await githubWriteFile(`content/shorts/${id}.json`, short, `Add short: ${short.title}`)
    return NextResponse.json({ success: true, id })
  } catch (err) {
    return NextResponse.json({ error: "Failed to save short" }, { status: 500 })
  }
}
