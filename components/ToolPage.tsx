'use client'

import { useState } from 'react'
import Link from 'next/link'
import FileUpload from '@/components/FileUpload'

interface ToolPageProps {
  name: string
  description: string
  icon: string
  color: string
}

export default function ToolPage({ name, description, icon, color }: ToolPageProps) {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleProcess = async () => {
    if (!file) return
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      alert('This tool is coming soon!')
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          ← Back to all tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 ${color} rounded-xl flex items-center justify-center`}>
              <span className="text-4xl">{icon}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
              <p className="text-gray-600">{description}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <FileUpload
            label="Upload your file"
            file={file}
            onFileSelect={setFile}
            accept=".csv"
            helperText="Drag and drop your file here or click to browse"
          />

          <div className="mt-6">
            <button
              onClick={handleProcess}
              disabled={!file || processing}
              className={`px-6 py-3 rounded font-medium transition-colors ${
                file && !processing
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {processing ? 'Processing...' : 'Process File'}
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              This tool is currently under development. Check back soon for full functionality.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
