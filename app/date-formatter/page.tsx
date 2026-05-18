'use client'

import { useState } from 'react'
import Link from 'next/link'
import PageSeo from '@/components/PageSeo'
import { SEO_PAGES } from '@/lib/seo'
import { parseDate } from '@/lib/normalization'
import Papa from 'papaparse'

export default function DateFormatterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [inputFormat, setInputFormat] = useState('auto')
  const [outputFormat, setOutputFormat] = useState('YYYY-MM-DD')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleProcess = async () => {
    if (!file) return
    setProcessing(true)
    setError(null)

    try {
      const text = await file.text()
      const data = Papa.parse(text, { header: false }).data as string[][]
      
      const formattedData = data.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          if (rowIndex === 0) return cell // Keep header as is
          
          const parsedDate = parseDate(cell)
          if (isNaN(parsedDate.getTime())) return cell // Return original if not a date
          
          return outputFormat === 'auto' ? cell : 
            outputFormat === 'DD/MM/YYYY' ? parsedDate.toLocaleDateString('en-GB') :
            outputFormat === 'MM/DD/YYYY' ? parsedDate.toLocaleDateString('en-US') :
            outputFormat === 'YYYY-MM-DD' ? parsedDate.toISOString().split('T')[0] :
            cell
        })
      })
      
      const csv = Papa.unparse(formattedData)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `formatted_dates_${file.name}`
      link.click()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PageSeo title={SEO_PAGES['date-formatter'].title} description={SEO_PAGES['date-formatter'].description} />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          ← Back to all tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-4xl">📅</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Date Formatter</h1>
              <p className="text-gray-600">Format dates in various formats</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors mb-6">
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

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Input Format</label>
              <select
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="auto">Auto-detect</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
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
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {processing ? 'Formatting...' : 'Format Dates'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
