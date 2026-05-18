'use client'

import { useState } from 'react'
import Link from 'next/link'
import PageSeo from '@/components/PageSeo'
import { SEO_PAGES } from '@/lib/seo'
import { parseCSVFile, aggregateCSV } from '@/lib/csvUtils'
import Papa from 'papaparse'

export default function AggregateCsvPage() {
  const [file, setFile] = useState<File | null>(null)
  const [groupColumn, setGroupColumn] = useState(0)
  const [aggColumn, setAggColumn] = useState(1)
  const [aggType, setAggType] = useState<'sum' | 'avg' | 'count'>('sum')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleProcess = async () => {
    if (!file) return
    setProcessing(true)
    setError(null)

    try {
      const data = await parseCSVFile(file)
      const aggregated = aggregateCSV(data, groupColumn, aggColumn, aggType)
      const csv = Papa.unparse(aggregated)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `aggregated_${file.name}`
      link.click()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PageSeo title={SEO_PAGES['aggregate-csv'].title} description={SEO_PAGES['aggregate-csv'].description} />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          ← Back to all tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-gray-500 rounded-xl flex items-center justify-center">
              <span className="text-4xl">📦</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CSV Aggregate</h1>
              <p className="text-gray-600">Aggregate CSV data by groups</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-slate-500 transition-colors mb-6">
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

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group column index</label>
              <input
                type="number"
                value={groupColumn}
                onChange={(e) => setGroupColumn(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aggregate column index</label>
              <input
                type="number"
                value={aggColumn}
                onChange={(e) => setAggColumn(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aggregation type</label>
              <select
                value={aggType}
                onChange={(e) => setAggType(e.target.value as 'sum' | 'avg' | 'count')}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="sum">Sum</option>
                <option value="avg">Average</option>
                <option value="count">Count</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleProcess}
              disabled={!file || processing}
              className={`px-6 py-3 rounded font-medium transition-colors ${
                file && !processing
                  ? 'bg-gradient-to-r from-slate-500 to-gray-500 text-white hover:from-slate-600 hover:to-gray-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {processing ? 'Aggregating...' : 'Aggregate CSV'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
