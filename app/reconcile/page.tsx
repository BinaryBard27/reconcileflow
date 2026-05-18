'use client'

import { useState } from 'react'
import Link from 'next/link'
import PageSeo from '@/components/PageSeo'
import { SEO_PAGES } from '@/lib/seo'
import FileUpload from '@/components/FileUpload'
import Results from '@/components/Results'
import ColumnMappingUI from '@/components/ColumnMapping'
import { parseStripeCSV, parseBankCSV, detectStripeColumns, detectBankColumns, parseCSV } from '@/lib/parser'
import { normalizeStripeTransaction, normalizeBankTransaction } from '@/lib/normalizer'
import { groupPayouts } from '@/lib/grouper'
import { matchTransactions } from '@/lib/matcher'
import type { ColumnMapping, ParseResult, MatchResult } from '@/types'

export default function ReconcilePage() {
  const [stripeFile, setStripeFile] = useState<File | null>(null)
  const [bankFile, setBankFile] = useState<File | null>(null)
  const [results, setResults] = useState<MatchResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [stripeParseResult, setStripeParseResult] = useState<ParseResult | null>(null)
  const [bankParseResult, setBankParseResult] = useState<ParseResult | null>(null)
  const [stripeMapping, setStripeMapping] = useState<ColumnMapping | null>(null)
  const [bankMapping, setBankMapping] = useState<ColumnMapping | null>(null)
  const [showMapping, setShowMapping] = useState(false)

  const handleStripeFileSelect = async (file: File | null) => {
    setStripeFile(file)
    setStripeParseResult(null)
    setStripeMapping(null)
    if (file) {
      try {
        const text = await file.text()
        const result = parseCSV(text)
        const mapping = detectStripeColumns(result.columns)
        setStripeParseResult(result)
        setStripeMapping(mapping)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse Stripe file')
      }
    }
  }

  const handleBankFileSelect = async (file: File | null) => {
    setBankFile(file)
    setBankParseResult(null)
    setBankMapping(null)
    if (file) {
      try {
        const text = await file.text()
        const result = parseCSV(text)
        const mapping = detectBankColumns(result.columns)
        setBankParseResult(result)
        setBankMapping(mapping)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse bank file')
      }
    }
  }

  const handleProcess = async () => {
    if (!stripeFile || !bankFile || !stripeMapping || !bankMapping) {
      setError('Please upload both files')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const stripeText = await stripeFile.text()
      const bankText = await bankFile.text()

      const stripeRaw = parseStripeCSV(stripeText, stripeMapping)
      const bankRaw = parseBankCSV(bankText, bankMapping)

      if (stripeRaw.length === 0) {
        throw new Error('No valid Stripe transactions found')
      }

      if (bankRaw.length === 0) {
        throw new Error('No valid bank transactions found')
      }

      const stripeTransactions = stripeRaw.map(normalizeStripeTransaction)
      const bankTransactions = bankRaw.map(normalizeBankTransaction)

      const payoutGroups = groupPayouts(stripeTransactions)
      const matchResult = matchTransactions(payoutGroups, bankTransactions)

      setResults(matchResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStripeFile(null)
    setBankFile(null)
    setResults(null)
    setError(null)
    setStripeParseResult(null)
    setBankParseResult(null)
    setStripeMapping(null)
    setBankMapping(null)
    setShowMapping(false)
  }

  const canProceed = stripeFile && bankFile && stripeMapping && bankMapping

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PageSeo title={SEO_PAGES.reconcile.title} description={SEO_PAGES.reconcile.description} />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          ← Back to all tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-4xl">💳</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Stripe Reconciliation</h1>
              <p className="text-gray-600">Match Stripe payouts with your bank statement in seconds</p>
            </div>
          </div>
        </div>

        {!results ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <FileUpload
                label="Stripe balance_transactions CSV"
                file={stripeFile}
                onFileSelect={handleStripeFileSelect}
                accept=".csv"
                helperText="Export from Stripe Dashboard → Balance → Transactions → Download CSV"
              />
              <FileUpload
                label="Bank statement CSV"
                file={bankFile}
                onFileSelect={handleBankFileSelect}
                accept=".csv"
                helperText="Upload a CSV bank statement with date and amount columns"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <p className="text-sm text-gray-500 mb-6">
              Files are processed in your browser. No data is uploaded.
            </p>

            {(stripeParseResult || bankParseResult) && (
              <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Parsing Results</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {stripeParseResult && (
                    <div>
                      <p className="text-gray-600">Stripe CSV</p>
                      <p className="font-medium">{stripeParseResult.rowCount} rows parsed</p>
                      <p className="text-gray-500">{stripeParseResult.columns.length} columns detected</p>
                    </div>
                  )}
                  {bankParseResult && (
                    <div>
                      <p className="text-gray-600">Bank CSV</p>
                      <p className="font-medium">{bankParseResult.rowCount} rows parsed</p>
                      <p className="text-gray-500">{bankParseResult.columns.length} columns detected</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {stripeParseResult && bankParseResult && (
              <div className="mb-6">
                <button
                  onClick={() => setShowMapping(!showMapping)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {showMapping ? 'Hide' : 'Review'} column mappings
                </button>
              </div>
            )}

            {showMapping && stripeParseResult && bankParseResult && stripeMapping && bankMapping && (
              <ColumnMappingUI
                stripeParseResult={stripeParseResult}
                bankParseResult={bankParseResult}
                stripeMapping={stripeMapping}
                bankMapping={bankMapping}
                onStripeMappingChange={setStripeMapping}
                onBankMappingChange={setBankMapping}
              />
            )}

            <div className="flex gap-4">
              <button
                onClick={handleProcess}
                disabled={!canProceed || loading}
                className={`px-6 py-3 rounded font-medium transition-colors ${
                  canProceed && !loading
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Processing...' : 'Reconcile'}
              </button>
            </div>
          </>
        ) : (
          <Results results={results} onReset={handleReset} />
        )}
      </div>
    </main>
  )
}
