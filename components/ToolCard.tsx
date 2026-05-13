'use client'

import Link from 'next/link'

interface ToolCardProps {
  name: string
  description: string
  color: string
  icon: string
  href: string
}

export default function ToolCard({ name, description, color, icon, href }: ToolCardProps) {
  return (
    <Link href={href}>
      <div className="tool-card bg-white rounded-xl p-6 border border-gray-200 cursor-pointer h-full">
        <div className={`w-16 h-16 ${color} rounded-xl flex items-center justify-center mb-4`}>
          <span className="text-3xl">{icon}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  )
}
