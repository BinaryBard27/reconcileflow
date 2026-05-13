'use client'

import { useCallback } from 'react'

interface FileUploadProps {
  label: string
  file: File | null
  onFileSelect: (file: File | null) => void
  accept: string
  helperText?: string
  icon?: React.ReactNode
  buttonColor?: string
}

export default function FileUpload({ label, file, onFileSelect, accept, helperText, icon, buttonColor = 'bg-blue-600 hover:bg-blue-700' }: FileUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile && droppedFile.type === 'text/csv' || droppedFile.name?.endsWith('.csv')) {
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
    <div 
      className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col h-full shadow-sm"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="flex items-start gap-4 mb-6 flex-1">
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{label}</h3>
          {helperText && (
            <p className="text-sm text-gray-500 mt-1">{helperText}</p>
          )}
        </div>
      </div>

      <div className="mt-auto pl-16">
        {file ? (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-gray-900 font-medium truncate mb-1" title={file.name}>{file.name}</p>
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-xs">{(file.size / 1024).toFixed(2)} KB</p>
              <button
                onClick={handleRemove}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div>
            <label className="cursor-pointer inline-block">
              <span className={`px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm inline-block ${buttonColor}`}>
                Choose file
              </span>
              <input
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-400 mt-3 font-medium">.csv format</p>
          </div>
        )}
      </div>
    </div>
  )
}
