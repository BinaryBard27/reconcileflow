'use client'

import { useState } from 'react'
import Link from 'next/link'
import { parseCSVFile, mergeCSVs } from '@/lib/csvUtils'
import Papa from 'papaparse'

export default function MergeCsvPage() {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    setFiles(selected)
  }

  const handleProcess = async () => {
    if (files.length < 2) return
    setProcessing(true)
    setError(null)

    try {
      const dataArrays = await Promise.all(files.map(parseCSVFile))
      const merged = mergeCSVs(dataArrays)
      const csv = Papa.unparse(merged)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'merged.csv'
      link.click()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process files')
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
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-4xl">🔗</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Merge CSV Files</h1>
              <p className="text-gray-600">Combine multiple CSV files into one</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
            <input
              type="file"
              accept=".csv"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-4xl mb-4">�</div>
              <p className="text-gray-600 mb-2">
                {files.length > 0 ? `${files.length} files selected` : 'Drop CSV files here or click to browse'}
              </p>
              <p className="text-sm text-gray-400">Select multiple .csv files</p>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Selected files:</p>
              <ul className="list-disc list-inside text-sm text-gray-500">
                {files.map((f, i) => <li key={i}>{f.name}</li>)}
              </ul>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-6">
              {error}
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleProcess}
              disabled={files.length < 2 || processing}
              className={`px-6 py-3 rounded font-medium transition-colors ${
                files.length >= 2 && !processing
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {processing ? 'Merging...' : 'Merge Files'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
