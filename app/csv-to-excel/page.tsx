'use client'

import { useState } from 'react'
import Link from 'next/link'
import PageSeo from '@/components/PageSeo'
import { SEO_PAGES } from '@/lib/seo'
import { parseCSVFile, convertToExcel } from '@/lib/csvUtils'

export default function CsvToExcelPage() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleProcess = async () => {
    if (!file) return
    setProcessing(true)
    setError(null)

    try {
      const data = await parseCSVFile(file)
      const filename = file.name.replace('.csv', '.xlsx')
      convertToExcel(data, filename)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PageSeo title={SEO_PAGES['csv-to-excel'].title} description={SEO_PAGES['csv-to-excel'].description} />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          ← Back to all tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-4xl">File</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CSV to Excel</h1>
              <p className="text-gray-600">Convert CSV files to Excel format</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-4xl mb-4">�</div>
              <p className="text-gray-600 mb-2">
                {file ? file.name : 'Drop your CSV file here or click to browse'}
              </p>
              <p className="text-sm text-gray-400">Supports .csv files</p>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-6">
              {error}
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleProcess}
              disabled={!file || processing}
              className={`px-6 py-3 rounded font-medium transition-colors ${
                file && !processing
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {processing ? 'Converting...' : 'Convert to Excel'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
