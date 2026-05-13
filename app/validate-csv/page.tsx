'use client'

import { useState } from 'react'
import Link from 'next/link'
import { parseCSVFile } from '@/lib/csvUtils'

export default function ValidateCsvPage() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any>(null)

  const handleProcess = async () => {
    if (!file) return
    setProcessing(true)
    setError(null)
    setResults(null)

    try {
      const data = await parseCSVFile(file)
      const issues: string[] = []
      
      if (data.length === 0) {
        issues.push('File is empty')
      } else {
        const headerCount = data[0].length
        data.forEach((row, index) => {
          if (row.length !== headerCount) {
            issues.push(`Row ${index + 1} has ${row.length} columns, expected ${headerCount}`)
          }
        })
        
        if (data.length < 2) {
          issues.push('File has no data rows (only header)')
        }
      }
      
      setResults({
        valid: issues.length === 0,
        totalRows: data.length,
        totalColumns: data.length > 0 ? data[0].length : 0,
        issues,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          ← Back to all tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-lime-500 to-green-500 rounded-xl flex items-center justify-center">
              <span className="text-4xl">Check</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CSV Validation</h1>
              <p className="text-gray-600">Validate CSV data against rules</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-lime-500 transition-colors mb-6">
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {results && (
            <div className={`${results.valid ? 'bg-green-50 border-green-200 text-green-800' : 'bg-orange-50 border-orange-200 text-orange-800'} border px-4 py-3 rounded mb-6`}>
              <p className="font-bold mb-2">{results.valid ? 'Valid CSV' : 'Invalid CSV'}</p>
              <p>Total rows: {results.totalRows}</p>
              <p>Total columns: {results.totalColumns}</p>
              {results.issues.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Issues:</p>
                  <ul className="list-disc list-inside text-sm">
                    {results.issues.map((issue: string, i: number) => <li key={i}>{issue}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleProcess}
              disabled={!file || processing}
              className={`px-6 py-3 rounded font-medium transition-colors ${
                file && !processing
                  ? 'bg-gradient-to-r from-lime-500 to-green-500 text-white hover:from-lime-600 hover:to-green-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {processing ? 'Validating...' : 'Validate CSV'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
