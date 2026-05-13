'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import FileUpload from '@/components/FileUpload'
import Results from '@/components/Results'
import ColumnMappingUI from '@/components/ColumnMapping'
import { parseStripeCSV, parseBankCSV, detectStripeColumns, detectBankColumns, parseCSV } from '@/lib/parser'
import { normalizeStripeTransaction, normalizeBankTransaction } from '@/lib/normalizer'
import { groupPayouts } from '@/lib/grouper'
import { matchTransactions } from '@/lib/matcher'
import type { ColumnMapping, ParseResult, MatchResult } from '@/types'

export default function Home() {
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
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {!results ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Reconcile Stripe payouts in 60 seconds
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Upload CSVs → Get instant matches → Download results. No data leaves your browser.
              </p>

              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 mb-12 max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-2xl">Lock</span>
                  <span className="text-lg font-bold text-emerald-800">100% Private & Secure</span>
                </div>
                <p className="text-emerald-700 text-center font-medium">
                  No data uploaded. No servers. All processing happens in your browser.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  <span>Check</span> Runs 100% in your browser
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  <span>Bolt</span> Instant matching
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                  <span>Money</span> Professional tool
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
                  <span>Lock</span> No account required
                </div>
              </div>

              <div className="max-w-2xl mx-auto mb-16">
                <button
                  onClick={() => document.getElementById('stripe-upload')?.click()}
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:from-red-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
                >
                  Match payouts now
                </button>
              </div>

              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">How it works</h2>
                
                {/* Demo Section */}
                <div className="bg-gray-50 rounded-xl p-8 mb-12">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">See it in action</h3>
                    <p className="text-gray-600">60-second demo showing the complete reconciliation process</p>
                  </div>
                  <div className="bg-white rounded-lg p-8 border-2 border-dashed border-gray-300">
                    <div className="flex items-center justify-center gap-4 text-gray-500">
                      <span className="text-4xl">Video</span>
                      <div>
                        <p className="font-medium">Demo Video</p>
                        <p className="text-sm">Upload CSVs → Match → Download results</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-xl sm:text-2xl">Upload</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Upload Stripe CSV</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Export your balance transactions from Stripe and upload the CSV file</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-xl sm:text-2xl">Bank</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Upload bank statement</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Upload your bank statement with payout deposits</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-xl sm:text-2xl">Check</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Get matched payouts</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Automatically match Stripe payouts with bank deposits</p>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="max-w-4xl mx-auto mt-16 pt-16 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Simple Pricing</h2>
                <div className="max-w-md mx-auto">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-2">Professional</h3>
                    <div className="text-4xl font-bold mb-4">£29<span className="text-lg font-normal">/month</span></div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center justify-center gap-2">
                        <span>✓</span>
                        <span>Unlimited reconciliations</span>
                      </li>
                      <li className="flex items-center justify-center gap-2">
                        <span>✓</span>
                        <span>Advanced matching algorithms</span>
                      </li>
                      <li className="flex items-center justify-center gap-2">
                        <span>✓</span>
                        <span>Export to CSV/Excel</span>
                      </li>
                      <li className="flex items-center justify-center gap-2">
                        <span>✓</span>
                        <span>Priority support</span>
                      </li>
                    </ul>
                    <button className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                      Start Free Trial
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
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

              <p className="text-sm text-gray-500 mb-6 text-center">
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
                <div className="mb-6 text-center">
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

              <div className="flex justify-center">
                <button
                  onClick={handleProcess}
                  disabled={!canProceed || loading}
                  className={`px-8 py-4 rounded-xl font-medium transition-colors text-lg ${
                    canProceed && !loading
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Processing...' : 'Reconcile Files'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <Results results={results} onReset={handleReset} />
        )}
      </div>
    </main>
  )
}
