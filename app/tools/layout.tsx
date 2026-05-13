import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Professional CSV Tools - ReconcileFlow",
  description: "Professional CSV tools including cleaner, deduplicator, date formatter, and more. Process your files securely in your browser.",
  keywords: ["CSV tools", "CSV cleaner", "CSV deduplicator", "date formatter", "professional online tools"],
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
