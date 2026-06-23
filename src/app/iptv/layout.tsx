import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "IPTV — Dad's TV",
  description: "Simple TV stream browser",
}

export default function IptvLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
