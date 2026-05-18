'use client'

import { useState } from 'react'
import Link from 'next/link'
import PageSeo from '@/components/PageSeo'
import { SEO_PAGES } from '@/lib/seo'
import { parseCSVFile, compareCSVs } from '@/lib/csvUtils'
import Papa from 'papaparse'

export default function CompareCsvPage() {
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any>(null)

  const handleProcess = async () => {
    if (!file1 || !file2) return
    setProcessing(true)
    setError(null)
    setResults(null)

    try {
      const data1 = await parseCSVFile(file1)
      const data2 = await parseCSVFile(file2)
      const comparison = compareCSVs(data1, data2)
      
      setResults({
        added: comparison.added.length,
        removed: comparison.removed.length,
        changed: comparison.changed.length,
        details: comparison,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process files')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PageSeo title={SEO_PAGES['compare-csv'].title} description={SEO_PAGES['compare-csv'].description} />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          ← Back to all tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-4xl">⚖️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CSV Compare</h1>
              <p className="text-gray-600">Compare two CSV files for differences</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile1(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload-1"
              />
              <label htmlFor="file-upload-1" className="cursor-pointer">
                <div className="text-3xl mb-2">File</div>
                <p className="text-sm text-gray-600">
                  {file1 ? file1.name : 'First CSV file'}
                </p>
              </label>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile2(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload-2"
              />
              <label htmlFor="file-upload-2" className="cursor-pointer">
                <div className="text-3xl mb-2">File</div>
                <p className="text-sm text-gray-600">
                  {file2 ? file2.name : 'Second CSV file'}
                </p>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {results && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded mb-6">
              <p>Rows added: {results.added}</p>
              <p>Rows removed: {results.removed}</p>
              <p>Rows changed: {results.changed}</p>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleProcess}
              disabled={!file1 || !file2 || processing}
              className={`px-6 py-3 rounded font-medium transition-colors ${
                file1 && file2 && !processing
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {processing ? 'Comparing...' : 'Compare Files'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
