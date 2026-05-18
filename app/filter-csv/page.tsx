'use client'

import { useState } from 'react'
import Link from 'next/link'
import PageSeo from '@/components/PageSeo'
import { SEO_PAGES } from '@/lib/seo'
import { parseCSVFile, filterCSV } from '@/lib/csvUtils'
import Papa from 'papaparse'

export default function FilterCsvPage() {
  const [file, setFile] = useState<File | null>(null)
  const [columnIndex, setColumnIndex] = useState(0)
  const [condition, setCondition] = useState('contains')
  const [value, setValue] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string[][] | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    setFile(selected)
    if (selected) {
      try {
        const data = await parseCSVFile(selected)
        setPreview(data.slice(0, 5))
      } catch (err) {
        setError('Failed to parse file')
      }
    }
  }

  const handleProcess = async () => {
    if (!file) return
    setProcessing(true)
    setError(null)

    try {
      const data = await parseCSVFile(file)
      const filtered = filterCSV(data, columnIndex, condition, value)
      const csv = Papa.unparse(filtered)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `filtered_${file.name}`
      link.click()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PageSeo title={SEO_PAGES['filter-csv'].title} description={SEO_PAGES['filter-csv'].description} />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          ← Back to all tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-4xl">Filter</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CSV Filter</h1>
              <p className="text-gray-600">Filter CSV data by conditions</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors mb-6">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
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

          {preview && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Column index (0 = first column)
              </label>
              <input
                type="number"
                value={columnIndex}
                onChange={(e) => setColumnIndex(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                min="0"
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="contains">Contains</option>
              <option value="equals">Equals</option>
              <option value="starts_with">Starts with</option>
              <option value="ends_with">Ends with</option>
              <option value="greater_than">Greater than</option>
              <option value="less_than">Less than</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
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
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {processing ? 'Filtering...' : 'Filter CSV'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
