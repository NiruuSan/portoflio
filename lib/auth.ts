import { cookies } from "next/headers"
import { createHmac, timingSafeEqual } from "crypto"

const COOKIE_NAME = "admin_session"
const COOKIE_VALUE = "authenticated"

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) {
    throw new Error("ADMIN_PASSWORD environment variable is required for admin access")
  }
  return secret
}

function sign(value: string): string {
  const secret = getSecret()
  const hmac = createHmac("sha256", secret)
  hmac.update(value)
  return hmac.digest("hex")
}

export async function verifyAuth(): Promise<boolean> {
  try {
    const secret = getSecret()
    const cookieStore = await cookies()
    const cookie = cookieStore.get(COOKIE_NAME)?.value
    if (!cookie) return false

    const [value, signature] = cookie.split(".")
    if (value !== COOKIE_VALUE || !signature) return false

    const expected = sign(value)
    if (expected.length !== signature.length) return false
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}

export async function setAuthCookie(): Promise<void> {
  const signature = sign(COOKIE_VALUE)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, `${COOKIE_VALUE}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
