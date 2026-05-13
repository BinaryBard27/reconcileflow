'use client'

import { useState } from 'react'
import type { MatchResult } from '@/types'

interface ResultsProps {
  results: MatchResult
  onReset: () => void
}

export default function Results({ results, onReset }: ResultsProps) {
  const [activeTab, setActiveTab] = useState<'matched' | 'needsReview' | 'unmatchedBank' | 'unmatchedStripe'>('matched')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount)
  }

  const getConfidenceLabel = (score: number) => {
    if (score > 1.6) return "High"
    if (score > 1.2) return "Medium"
    return "Low"
  }

  const downloadResults = (type: 'matched' | 'unmatched') => {
    let csv = ''
    let filename = ''
    
    if (type === 'matched') {
      csv = 'payout_id,bank_date,payout_amount,bank_amount,confidence\n'
      results.matches.forEach(match => {
        csv += `${match.payout.payout_id},${match.bank.date},${match.payout.total_net},${match.bank.amount},${match.confidence}\n`
      })
      filename = 'matched_payouts.csv'
    } else {
      csv = 'type,date,amount,description\n'
      results.unmatchedBank.forEach(bank => {
        csv += `bank,${bank.date},${bank.amount},${bank.description}\n`
      })
      results.unmatchedPayouts.forEach(payout => {
        csv += `stripe,${payout.payout_date},${payout.total_net},${payout.payout_id}\n`
      })
      filename = 'unmatched_items.csv'
    }
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reconciliation Complete</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">Matched</p>
            <p className="text-2xl font-bold text-green-900">{results.summary.transactionCount}</p>
            <p className="text-sm text-green-600">{formatCurrency(results.summary.totalMatchedAmount)}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-medium">Needs Review</p>
            <p className="text-2xl font-bold text-yellow-900">{results.summary.needsReviewCount || 0}</p>
            <p className="text-sm text-yellow-600">Manual verification required</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-800 font-medium">Unmatched Bank</p>
            <p className="text-2xl font-bold text-orange-900">{results.unmatchedBank.length}</p>
            <p className="text-sm text-orange-600">
              {formatCurrency(results.unmatchedBank.reduce((sum, tx) => sum + tx.amount, 0))}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">Unmatched Stripe</p>
            <p className="text-2xl font-bold text-red-900">{results.unmatchedPayouts.length}</p>
            <p className="text-sm text-red-600">
              {formatCurrency(results.unmatchedPayouts.reduce((sum, p) => sum + p.total_net, 0))}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('matched')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'matched'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Matched ({results.summary.transactionCount})
          </button>
          <button
            onClick={() => setActiveTab('needsReview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'needsReview'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Needs Review ({results.summary.needsReviewCount || 0})
          </button>
          <button
            onClick={() => setActiveTab('unmatchedBank')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'unmatchedBank'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Unmatched Bank ({results.unmatchedBank.length})
          </button>
          <button
            onClick={() => setActiveTab('unmatchedStripe')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'unmatchedStripe'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Unmatched Stripe ({results.unmatchedPayouts.length})
          </button>
        </nav>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'matched' && <MatchedTable matched={results.matches} expandedCard={expandedCard} setExpandedCard={setExpandedCard} />}
        {activeTab === 'needsReview' && <NeedsReviewTable needsReview={results.needsReview || []} expandedCard={expandedCard} setExpandedCard={setExpandedCard} />}
        {activeTab === 'unmatchedBank' && <UnmatchedBankTable unmatchedBank={results.unmatchedBank} />}
        {activeTab === 'unmatchedStripe' && <UnmatchedStripeTable unmatchedPayouts={results.unmatchedPayouts} />}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => downloadResults('matched')}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-colors"
          >
            Download Matched CSV
          </button>
          <button
            onClick={() => downloadResults('unmatched')}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors"
          >
            Download Unmatched CSV
          </button>
          <button
            onClick={onReset}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
          >
            Start New Reconciliation
          </button>
        </div>
      </div>
    </div>
  )
}

function ExplanationLayer({ pair }: any) {
  const explanation = pair.explanation || {
    gross: pair.payout.total_gross || 0,
    fees: pair.payout.total_fees || 0,
    refunds: pair.payout.total_refunds || 0,
    expected: pair.payout.total_net || 0,
    actual: pair.bank.amount || 0,
    difference: (pair.bank.amount || 0) - (pair.payout.total_net || 0),
  }
  
  const hasMismatch = Math.abs(explanation.difference) > 0.01

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Stripe Breakdown</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Gross:</span>
              <span>{formatCurrency(explanation.gross)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fees:</span>
              <span className="text-red-600">-{formatCurrency(explanation.fees)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Refunds:</span>
              <span className="text-red-600">-{formatCurrency(explanation.refunds)}</span>
            </div>
            <div className="border-t pt-1 mt-1">
              <div className="flex justify-between font-medium">
                <span>Expected:</span>
                <span>{formatCurrency(explanation.expected)}</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Bank Entry</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Actual:</span>
              <span>{formatCurrency(explanation.actual)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Difference:</span>
              <span className={hasMismatch ? 'text-red-600' : 'text-green-600'}>
                {hasMismatch ? '-' : '+'}{formatCurrency(Math.abs(explanation.difference))}
              </span>
            </div>
          </div>
        </div>
      </div>
      {hasMismatch && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2 rounded text-sm">
          Warning: Amount mismatch detected
        </div>
      )}
    </div>
  )
}

function NeedsReviewTable({ needsReview, expandedCard, setExpandedCard }: any) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount)
  }

  return (
    <div className="space-y-3">
      {needsReview.map((pair: any) => (
        <div key={pair.payout.payout_id} className="bg-yellow-50 border border-yellow-200 rounded-lg overflow-hidden">
          <div
            className="p-4 cursor-pointer hover:bg-yellow-100"
            onClick={() => setExpandedCard(expandedCard === pair.payout.payout_id ? null : pair.payout.payout_id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <p className="font-medium text-gray-900">{pair.payout.payout_id}</p>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    Warning: Needs Review
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>{pair.payout.payout_date}</span>
                  <span>{formatCurrency(pair.payout.total_net)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Bank entry</p>
                <p className="font-medium text-gray-900">{formatCurrency(pair.bank.amount)}</p>
              </div>
            </div>
          </div>

          {expandedCard === pair.payout.payout_id && (
            <div className="border-t border-yellow-200 p-4 bg-yellow-50">
              <ExplanationLayer pair={pair} />
              <div className="mt-4 p-3 bg-amber-100 border border-amber-200 rounded text-sm text-amber-800">
                Warning: This match requires manual verification. Check amounts and dates carefully.
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function MatchedTable({ matched, expandedCard, setExpandedCard }: any) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount)
  }

  const getConfidenceLabel = (score: number) => {
    if (score > 1.6) return "High"
    if (score > 1.2) return "Medium"
    return "Low"
  }

  return (
    <div className="space-y-3">
      {matched.map((pair: any) => (
        <div key={pair.payout.payout_id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div
            className="p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => setExpandedCard(expandedCard === pair.payout.payout_id ? null : pair.payout.payout_id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <p className="font-medium text-gray-900">{pair.payout.payout_id}</p>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      pair.confidence > 1.6
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {getConfidenceLabel(pair.confidence)} confidence
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>{pair.payout.payout_date}</span>
                  <span>{formatCurrency(pair.payout.total_net)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Bank entry</p>
                <p className="font-medium text-gray-900">{formatCurrency(pair.bank.amount)}</p>
              </div>
            </div>
          </div>

          {expandedCard === pair.payout.payout_id && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <ExplanationLayer pair={pair} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function UnmatchedBankTable({ unmatchedBank }: any) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount)
  }

  return (
    <div className="space-y-2">
      {unmatchedBank.map((bank: any, index: number) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">{bank.date}</p>
              <p className="font-medium text-gray-900">{bank.description}</p>
            </div>
            <p className="font-medium text-red-600">{formatCurrency(bank.amount)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function UnmatchedStripeTable({ unmatchedPayouts }: any) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount)
  }

  return (
    <div className="space-y-2">
      {unmatchedPayouts.map((payout: any, index: number) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">{payout.payout_date}</p>
              <p className="font-medium text-gray-900">{payout.payout_id}</p>
            </div>
            <p className="font-medium text-red-600">{formatCurrency(payout.total_net)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
