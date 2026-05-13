'use client'

import { useState } from 'react'
import Link from 'next/link'
import { parseCSVFile } from '@/lib/csvUtils'
import Papa from 'papaparse'

export default function PivotCsvPage() {
  const [file, setFile] = useState<File | null>(null)
  const [rowColumn, setRowColumn] = useState(0)
  const [colColumn, setColColumn] = useState(1)
  const [valueColumn, setValueColumn] = useState(2)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleProcess = async () => {
    if (!file) return
    setProcessing(true)
    setError(null)

    try {
      const data = await parseCSVFile(file)
      const headers = data[0]
      const rows = data.slice(1)
      
      const pivot: { [key: string]: { [key: string]: number } } = {}
      
      rows.forEach(row => {
        const rowKey = row[rowColumn]
        const colKey = row[colColumn]
        const value = parseFloat(row[valueColumn]) || 0
        
        if (!pivot[rowKey]) pivot[rowKey] = {}
        if (!pivot[rowKey][colKey]) pivot[rowKey][colKey] = 0
        pivot[rowKey][colKey] += value
      })
      
      const colKeys = Object.keys(pivot[Object.keys(pivot)[0]] || {})
      const pivotData: any[][] = [[headers[rowColumn], ...colKeys]]
      
      Object.entries(pivot).forEach(([rowKey, cols]) => {
        pivotData.push([rowKey, ...colKeys.map(k => cols[k] || 0)])
      })
      
      const csv = Papa.unparse(pivotData)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `pivot_${file.name}`
      link.click()
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
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-4xl">Refresh</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CSV Pivot</h1>
              <p className="text-gray-600">Create pivot tables from CSV data</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors mb-6">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Row column index</label>
              <input
                type="number"
                value={rowColumn}
                onChange={(e) => setRowColumn(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Column column index</label>
              <input
                type="number"
                value={colColumn}
                onChange={(e) => setColColumn(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Value column index</label>
              <input
                type="number"
                value={valueColumn}
                onChange={(e) => setValueColumn(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              disabled={!file || processing}
              className={`px-6 py-3 rounded font-medium transition-colors ${
                file && !processing
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {processing ? 'Pivoting...' : 'Create Pivot Table'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
