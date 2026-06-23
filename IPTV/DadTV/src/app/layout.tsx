import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Dad\u2019s TV \u2014 IPTV Player",
  description: "Simple TV stream browser",
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
