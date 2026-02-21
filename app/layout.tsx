import type { Metadata, Viewport } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { getGlobalContent } from "@/lib/content"

const _spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
})
const _dmSans = DM_Sans({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const content = await getGlobalContent()
  return {
    title: content.metadata.title,
    description: content.metadata.description,
    generator: "v0.app",
    icons: {
      icon: [
        {
          url: "/icon-light-32x32.png",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/icon-dark-32x32.png",
          media: "(prefers-color-scheme: dark)",
        },
        {
          url: "/icon.svg",
          type: "image/svg+xml",
        },
      ],
      apple: "/apple-icon.png",
    },
  }
}

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="relative font-sans antialiased" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
