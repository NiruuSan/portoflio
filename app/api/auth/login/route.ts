import { NextResponse } from "next/server"
import { setAuthCookie } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const expected = process.env.ADMIN_PASSWORD

    if (!expected) {
      return NextResponse.json(
        { error: "Admin password not configured. Set ADMIN_PASSWORD in .env" },
        { status: 500 }
      )
    }

    if (password !== expected) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    await setAuthCookie()
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
