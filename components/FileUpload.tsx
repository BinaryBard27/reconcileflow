'use client'

import { useCallback } from 'react'

interface FileUploadProps {
  label: string
  file: File | null
  onFileSelect: (file: File | null) => void
  accept: string
  helperText?: string
}

export default function FileUpload({ label, file, onFileSelect, accept, helperText }: FileUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile && droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        onFileSelect(droppedFile)
      }
    },
    [onFileSelect]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    if (selectedFile) {
      onFileSelect(selectedFile)
    }
  }

  const handleRemove = () => {
    onFileSelect(null)
  }

  return (
    <div>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="min-h-[120px] flex flex-col items-center justify-center"
        >
          {file ? (
            <div className="w-full">
              <p className="text-gray-900 font-medium mb-2">{file.name}</p>
              <p className="text-gray-500 text-sm mb-4">{(file.size / 1024).toFixed(2)} KB</p>
              <button
                onClick={handleRemove}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-4">{label}</p>
              <label className="cursor-pointer">
                <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                  Choose File
                </span>
                <input
                  type="file"
                  accept={accept}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>
      </div>
      {helperText && !file && (
        <p className="text-sm text-gray-500 mt-2">{helperText}</p>
      )}
    </div>
  )
}
