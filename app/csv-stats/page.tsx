'use client'

import { useState } from 'react'
import Link from 'next/link'
import PageSeo from '@/components/PageSeo'
import { SEO_PAGES } from '@/lib/seo'
import { parseCSVFile, calculateStats } from '@/lib/csvUtils'

export default function CsvStatsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [columnIndex, setColumnIndex] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)

  const handleProcess = async () => {
    if (!file) return
    setProcessing(true)
    setError(null)
    setStats(null)

    try {
      const data = await parseCSVFile(file)
      const result = calculateStats(data, columnIndex)
      setStats(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PageSeo title={SEO_PAGES['csv-stats'].title} description={SEO_PAGES['csv-stats'].description} />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          ← Back to all tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <span className="text-4xl">Chart</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CSV Statistics</h1>
              <p className="text-gray-600">Calculate statistics from CSV data</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors mb-6">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-4xl mb-4">📁</div>
              <p className="text-gray-600 mb-2">
                {file ? file.name : 'Drop your CSV file here or click to browse'}
              </p>
              <p className="text-sm text-gray-400">Supports .csv files</p>
            </label>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Column index (0 = first column)
            </label>
            <input
              type="number"
              value={columnIndex}
              onChange={(e) => setColumnIndex(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min="0"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {stats && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded mb-6">
              <p>Count: {stats.count}</p>
              <p>Sum: {stats.sum}</p>
              <p>Average: {stats.avg}</p>
              <p>Min: {stats.min}</p>
              <p>Max: {stats.max}</p>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleProcess}
              disabled={!file || processing}
              className={`px-6 py-3 rounded font-medium transition-colors ${
                file && !processing
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {processing ? 'Calculating...' : 'Calculate Statistics'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
