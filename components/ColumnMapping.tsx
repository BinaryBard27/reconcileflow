'use client'

import type { ParseResult, ColumnMapping } from '@/types'

interface ColumnMappingUIProps {
  stripeParseResult: ParseResult
  bankParseResult: ParseResult
  stripeMapping: ColumnMapping
  bankMapping: ColumnMapping
  onStripeMappingChange: (mapping: ColumnMapping) => void
  onBankMappingChange: (mapping: ColumnMapping) => void
}

export default function ColumnMappingUI({
  stripeParseResult,
  bankParseResult,
  stripeMapping,
  bankMapping,
  onStripeMappingChange,
  onBankMappingChange,
}: ColumnMappingUIProps) {
  const stripeFields = [
    { key: 'payout_id', label: 'Payout ID', required: true },
    { key: 'created', label: 'Created Date', required: true },
    { key: 'amount', label: 'Amount', required: true },
    { key: 'fee', label: 'Fee', required: true },
    { key: 'net', label: 'Net', required: true },
    { key: 'type', label: 'Type', required: true },
  ]

  const bankFields = [
    { key: 'date', label: 'Date', required: true },
    { key: 'amount', label: 'Amount', required: true },
    { key: 'description', label: 'Description', required: false },
  ]

  const handleStripeMappingChange = (field: string, value: string) => {
    onStripeMappingChange({ ...stripeMapping, [field]: value })
  }

  const handleBankMappingChange = (field: string, value: string) => {
    onBankMappingChange({ ...bankMapping, [field]: value })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white border border-gray-200 rounded p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stripe Columns</h3>
        <p className="text-sm text-gray-600 mb-4">
          {stripeParseResult.rowCount} rows parsed
        </p>
        <div className="space-y-3">
          {stripeFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <select
                value={stripeMapping[field.key] || ''}
                onChange={(e) => handleStripeMappingChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select column</option>
                {stripeParseResult.columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview (first 5 rows)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {stripeParseResult.columns.slice(0, 5).map((col) => (
                    <th key={col} className="px-2 py-1 text-left font-medium text-gray-600">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stripeParseResult.data.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-b">
                    {stripeParseResult.columns.slice(0, 5).map((col) => (
                      <td key={col} className="px-2 py-1 text-gray-700">
                        {String(row[col] || '').substring(0, 20)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Columns</h3>
        <p className="text-sm text-gray-600 mb-4">
          {bankParseResult.rowCount} rows parsed
        </p>
        <div className="space-y-3">
          {bankFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <select
                value={bankMapping[field.key] || ''}
                onChange={(e) => handleBankMappingChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select column</option>
                {bankParseResult.columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview (first 5 rows)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {bankParseResult.columns.slice(0, 5).map((col) => (
                    <th key={col} className="px-2 py-1 text-left font-medium text-gray-600">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bankParseResult.data.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-b">
                    {bankParseResult.columns.slice(0, 5).map((col) => (
                      <td key={col} className="px-2 py-1 text-gray-700">
                        {String(row[col] || '').substring(0, 20)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
