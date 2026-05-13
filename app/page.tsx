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
    <main className="min-h-screen bg-[#fafbff] overflow-hidden">
      <Header />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 -z-10 w-full h-[800px] overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-purple-100/40 to-blue-50/40 blur-3xl" />
          <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-pink-100/40 to-purple-100/40 blur-3xl" />
          {/* subtle dot pattern */}
          <div className="absolute top-[10%] right-[15%] w-64 h-64 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 2px, transparent 2px)', backgroundSize: '24px 24px' }} />
        </div>

        {!results ? (
          <div className="py-12 sm:py-20">
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center mb-24">
              
              {/* Left Column - Content */}
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 font-semibold text-sm mb-6 border border-purple-100 shadow-sm">
                  <span className="text-purple-600">⚡</span> Fast. Secure. Accurate.
                </div>
                
                <h1 className="text-[3.5rem] leading-[1.1] font-bold text-[#0A0A0A] tracking-tight mb-6">
                  Reconcile Stripe payouts<br/>
                  in <span className="bg-gradient-to-r from-blue-600 to-pink-500 text-transparent bg-clip-text">60 seconds</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Upload CSVs — Get instant matches — Download results.<br />
                  No data leaves your browser.
                </p>

                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 mb-8 flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-800 mb-1">Lock 100% Private & Secure</h3>
                    <p className="text-sm text-emerald-700">No data uploaded. No server. All processing happens in your browser.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    Check Rank 100% in your browser
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    Instant matching
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Advanced AI matching
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-orange-600">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    No account required
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => document.getElementById('stripe-upload')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF3366] to-[#FF6B3D] text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all w-full sm:w-auto"
                  >
                    🚀 Match payouts now
                  </button>
                  <p className="text-sm text-gray-500 mt-3 sm:text-center w-full sm:w-auto sm:px-4">No signup. No data stored.</p>
                </div>
              </div>

              {/* Right Column - Graphics */}
              <div className="relative h-[600px] hidden lg:block">
                {/* Stripe Card */}
                <div className="absolute top-[10%] right-[10%] w-72 bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-5 border border-gray-100 transform -rotate-2 z-10">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stripe Payout</p>
                    <div className="bg-[#635BFF]/10 text-[#635BFF] text-xs font-bold px-2 py-1 rounded-md">stripe</div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">$12,650.00</p>
                  <p className="text-sm text-gray-400">Total amount</p>
                </div>

                {/* Bank Card */}
                <div className="absolute top-[40%] right-[20%] w-72 bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-5 border border-gray-100 transform rotate-1 z-20">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bank Statement</p>
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">$12,650.00</p>
                  <p className="text-sm text-gray-400">Total amount</p>
                </div>

                {/* Match Card */}
                <div className="absolute top-[70%] right-[5%] w-72 bg-white rounded-2xl shadow-2xl shadow-emerald-900/10 p-6 border border-emerald-50 transform -rotate-1 z-30">
                  <div className="absolute -top-3 -left-3 text-2xl">✨</div>
                  <p className="text-lg font-bold text-emerald-500 mb-1">Match Found</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-3xl font-black text-gray-900 mb-1">100%</p>
                      <p className="text-sm text-gray-500">Perfect match</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 relative">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      {/* Confetti decoration */}
                      <div className="absolute -top-4 -right-4 w-2 h-2 bg-pink-400 rounded-full"></div>
                      <div className="absolute top-2 -right-6 w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="absolute -top-6 left-2 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How it works Section */}
            <div className="mb-24">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">✨ How it works ✨</h2>
                <p className="text-gray-500">Simple 4-step process to reconcile your payouts</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                {/* Connecting lines for desktop */}
                <div className="hidden lg:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-purple-100 via-blue-100 to-purple-100 -z-10 border-t border-dashed border-purple-200" />

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  </div>
                  <div className="absolute top-4 right-4 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">01</div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Upload</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Upload Stripe CSV and your bank statement CSV files securely.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <div className="absolute top-4 right-4 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">02</div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Bank</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Upload your bank statement with payout deposits.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>
                  <div className="absolute top-4 right-4 text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">03</div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Check</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">We automatically match Stripe payouts with bank deposits using advanced logic.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  </div>
                  <div className="absolute top-4 right-4 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">04</div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Download</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Export matched results and reconciliation summary instantly.</p>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div id="stripe-upload" className="max-w-4xl mx-auto bg-white/60 backdrop-blur-sm border border-purple-100 rounded-3xl p-8 sm:p-12 shadow-sm">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-gray-900 inline-block relative">
                  Upload your files to get started
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-purple-200 rounded-full" />
                </h2>
              </div>

              <div className="border border-dashed border-gray-300 rounded-2xl p-6 sm:p-8 bg-white/80 relative">
                {/* Connecting arrow/line */}
                <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full border border-gray-100 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-6 relative">
                  <FileUpload
                    label="Stripe payouts CSV"
                    file={stripeFile}
                    onFileSelect={handleStripeFileSelect}
                    accept=".csv"
                    helperText="Export from Stripe Dashboard"
                    icon={
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                        <span className="text-indigo-600 font-black text-2xl">S</span>
                      </div>
                    }
                    buttonColor="bg-[#635BFF] hover:bg-[#4B45CC]"
                  />
                  <FileUpload
                    label="Bank statement CSV"
                    file={bankFile}
                    onFileSelect={handleBankFileSelect}
                    accept=".csv"
                    helperText="Upload statement with date and amount columns"
                    icon={
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      </div>
                    }
                    buttonColor="bg-[#10B981] hover:bg-[#059669]"
                  />
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-8 pt-6 border-t border-dashed border-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  Files are processed in your browser. No data is uploaded. Ever.
                </div>
              </div>

              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm text-sm font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  {error}
                </div>
              )}

              {(stripeParseResult || bankParseResult) && (
                <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 mt-6 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Parsing Results</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {stripeParseResult && (
                      <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <p className="font-semibold text-gray-800 mb-1">Stripe CSV</p>
                        <p className="text-gray-600 mb-1">{stripeParseResult.rowCount} rows parsed</p>
                        <p className="text-gray-500 text-xs">{stripeParseResult.columns.length} columns detected</p>
                      </div>
                    )}
                    {bankParseResult && (
                      <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <p className="font-semibold text-gray-800 mb-1">Bank CSV</p>
                        <p className="text-gray-600 mb-1">{bankParseResult.rowCount} rows parsed</p>
                        <p className="text-gray-500 text-xs">{bankParseResult.columns.length} columns detected</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {stripeParseResult && bankParseResult && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowMapping(!showMapping)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-4"
                  >
                    {showMapping ? 'Hide' : 'Review'} column mappings
                  </button>
                </div>
              )}

              {showMapping && stripeParseResult && bankParseResult && stripeMapping && bankMapping && (
                <div className="mt-6">
                  <ColumnMappingUI
                    stripeParseResult={stripeParseResult}
                    bankParseResult={bankParseResult}
                    stripeMapping={stripeMapping}
                    bankMapping={bankMapping}
                    onStripeMappingChange={setStripeMapping}
                    onBankMappingChange={setBankMapping}
                  />
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleProcess}
                  disabled={!canProceed || loading}
                  className={`px-10 py-4 rounded-xl font-bold transition-all text-lg shadow-sm ${
                    canProceed && !loading
                      ? 'bg-gradient-to-r from-[#FF3366] to-[#FF6B3D] text-white hover:from-red-600 hover:to-orange-600 hover:shadow-md'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Processing...' : 'Reconcile Files'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 relative z-10">
            <Results results={results} onReset={handleReset} />
          </div>
        )}
      </div>
    </main>
  )
}
