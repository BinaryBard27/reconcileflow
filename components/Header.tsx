'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">ReconcileFlow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/tools" className="text-blue-600 hover:text-blue-800 font-medium">
              Free Tools
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
