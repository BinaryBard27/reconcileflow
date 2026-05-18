'use client'

import { useState } from 'react'
import Link from 'next/link'
import PageSeo from '@/components/PageSeo'
import { SEO_PAGES } from '@/lib/seo'
import Papa from 'papaparse'

export default function SampleCsvPage() {
  const [rowCount, setRowCount] = useState(10)
  const [columnCount, setColumnCount] = useState(3)
  const [processing, setProcessing] = useState(false)

  const handleProcess = () => {
    setProcessing(true)
    
    const headers = Array.from({ length: columnCount }, (_, i) => `Column ${i + 1}`)
    const rows = Array.from({ length: rowCount }, () => 
      Array.from({ length: columnCount }, () => Math.random().toString(36).substring(7))
    )
    
    const data = [headers, ...rows]
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'sample.csv'
    link.click()
    
    setProcessing(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PageSeo title={SEO_PAGES['sample-csv'].title} description={SEO_PAGES['sample-csv'].description} />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          ← Back to all tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-neutral-500 to-gray-500 rounded-xl flex items-center justify-center">
              <span className="text-4xl">🎲</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CSV Sample</h1>
              <p className="text-gray-600">Generate sample CSV data</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of rows</label>
              <input
                type="number"
                value={rowCount}
                onChange={(e) => setRowCount(parseInt(e.target.value) || 10)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-500"
                min="1"
                max="1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of columns</label>
              <input
                type="number"
                value={columnCount}
                onChange={(e) => setColumnCount(parseInt(e.target.value) || 3)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-500"
                min="1"
                max="20"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleProcess}
              disabled={processing}
              className={`px-6 py-3 rounded font-medium transition-colors ${
                !processing
                  ? 'bg-gradient-to-r from-neutral-500 to-gray-500 text-white hover:from-neutral-600 hover:to-gray-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {processing ? 'Generating...' : 'Generate Sample CSV'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
