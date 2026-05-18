import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import Providers from "@/components/Providers"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "ReconcileFlow",
    template: "%s",
  },
  description: "Stripe payout reconciliation and free CSV tools. Runs entirely in your browser.",
  keywords: ["Stripe reconciliation", "bank statement matching", "Stripe payout", "accounting automation", "professional reconciliation tool"],
  authors: [{ name: "ReconcileFlow" }],
  openGraph: {
    title: "ReconcileFlow - Professional Stripe Bank Reconciliation",
    description: "Match Stripe payouts with bank statements automatically. Professional tool with confidence scoring and manual review.",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReconcileFlow - Professional Stripe Bank Reconciliation",
    description: "Match Stripe payouts with bank statements automatically. Professional tool with confidence scoring and manual review.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
