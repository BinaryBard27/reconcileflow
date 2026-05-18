'use client'

import { useState } from 'react'
import Link from 'next/link'
import PageSeo from '@/components/PageSeo'
import { SEO_PAGES } from '@/lib/seo'
import { parseCSVFile } from '@/lib/csvUtils'
import Papa from 'papaparse'

export default function JoinCsvPage() {
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [joinColumn1, setJoinColumn1] = useState(0)
  const [joinColumn2, setJoinColumn2] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleProcess = async () => {
    if (!file1 || !file2) return
    setProcessing(true)
    setError(null)

    try {
      const data1 = await parseCSVFile(file1)
      const data2 = await parseCSVFile(file2)
      
      const headers1 = data1[0]
      const headers2 = data2[0]
      const rows1 = data1.slice(1)
      const rows2 = data2.slice(1)
      
      const map2 = new Map()
      rows2.forEach(row => {
        const key = row[joinColumn2]
        map2.set(key, row)
      })
      
      const joinedHeaders = [...headers1, ...headers2.filter((h: any, i: number) => i !== joinColumn2)]
      const joinedRows: any[][] = [joinedHeaders]
      
      rows1.forEach(row1 => {
        const key = row1[joinColumn1]
        const row2 = map2.get(key)
        if (row2) {
          const joinedRow = [...row1, ...row2.filter((_: any, i: number) => i !== joinColumn2)]
          joinedRows.push(joinedRow)
        }
      })
      
      const csv = Papa.unparse(joinedRows)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'joined.csv'
      link.click()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process files')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PageSeo title={SEO_PAGES['join-csv'].title} description={SEO_PAGES['join-csv'].description} />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          ← Back to all tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
              <span className="text-4xl">🔗</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CSV Join</h1>
              <p className="text-gray-600">Join CSV files on common columns</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-500 transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile1(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload-1"
              />
              <label htmlFor="file-upload-1" className="cursor-pointer">
                <div className="text-3xl mb-2">📁</div>
                <p className="text-sm text-gray-600">
                  {file1 ? file1.name : 'First CSV file'}
                </p>
              </label>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-500 transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile2(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload-2"
              />
              <label htmlFor="file-upload-2" className="cursor-pointer">
                <div className="text-3xl mb-2">📁</div>
                <p className="text-sm text-gray-600">
                  {file2 ? file2.name : 'Second CSV file'}
                </p>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Join column (file 1)</label>
              <input
                type="number"
                value={joinColumn1}
                onChange={(e) => setJoinColumn1(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Join column (file 2)</label>
              <input
                type="number"
                value={joinColumn2}
                onChange={(e) => setJoinColumn2(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rose-500"
                min="0"
              />
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
              disabled={!file1 || !file2 || processing}
              className={`px-6 py-3 rounded font-medium transition-colors ${
                file1 && file2 && !processing
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {processing ? 'Joining...' : 'Join Files'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
