'use client'

import { useState } from 'react'
import type { MatchResult } from '@/types'

interface ResultsProps {
  results: MatchResult
  onReset: () => void
}

export default function Results({ results, onReset }: ResultsProps) {
  const [activeTab, setActiveTab] = useState<'matched' | 'unmatchedBank' | 'unmatchedStripe'>('matched')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const tabs = [
    { id: 'matched' as const, label: 'Matched', count: results.matched.length },
    { id: 'unmatchedBank' as const, label: 'Unmatched Bank', count: results.unmatchedBank.length },
    { id: 'unmatchedStripe' as const, label: 'Unmatched Stripe', count: results.unmatchedPayouts.length },
  ]

  return (
    <div>
      <div className="mb-8 p-6 bg-white border border-gray-200 rounded">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Matched Amount</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(results.summary.totalMatchedAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Unmatched Amount</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(results.summary.totalUnmatchedAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Matched Transactions</p>
            <p className="text-2xl font-semibold text-gray-900">
              {results.summary.transactionCount}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setExpandedCard(null)
              }}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded p-6">
        {activeTab === 'matched' && (
          <MatchedCards matched={results.matched} expandedCard={expandedCard} setExpandedCard={setExpandedCard} />
        )}
        {activeTab === 'unmatchedBank' && <UnmatchedBankList transactions={results.unmatchedBank} />}
        {activeTab === 'unmatchedStripe' && <UnmatchedStripeList payouts={results.unmatchedPayouts} />}
      </div>

      <div className="mt-6">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium"
        >
          Start Over
        </button>
      </div>
    </div>
  )
}

function MatchedCards({ matched, expandedCard, setExpandedCard }: any) {
  if (matched.length === 0) {
    return <div className="text-center text-gray-600 py-8">No matched transactions</div>
  }

  return (
    <div className="space-y-4">
      {matched.map((pair: any) => (
        <div
          key={pair.payout.payout_id}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
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
                      pair.confidence === 'high'
                        ? 'bg-green-100 text-green-800'
                        : pair.confidence === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {pair.confidence.charAt(0).toUpperCase() + pair.confidence.slice(1)} confidence
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>{pair.payout.payout_date}</span>
                  <span>{formatCurrency(pair.payout.total_net)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Bank entry</p>
                <p className="font-medium text-gray-900">{formatCurrency(pair.bankTransaction.amount)}</p>
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

function ExplanationLayer({ pair }: any) {
  const explanation = pair.explanation || {
    gross: pair.payout.total_gross || 0,
    fees: pair.payout.total_fees || 0,
    refunds: pair.payout.total_refunds || 0,
    expected: pair.payout.total_net || 0,
    actual: pair.bankTransaction.amount || 0,
    difference: (pair.bankTransaction.amount || 0) - (pair.payout.total_net || 0),
  }
  
  const hasMismatch = Math.abs(explanation.difference) > 0.01

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
          ⚠️ Amount mismatch detected
        </div>
      )}
    </div>
  )
}

function MatchedTable({ matched, expandedCard, setExpandedCard }: any) {
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
                      pair.confidence >= 1.8
                        ? 'bg-green-100 text-green-800'
                        : pair.confidence >= 1.4
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {pair.confidence >= 1.8 ? 'High' : pair.confidence >= 1.4 ? 'Medium' : 'Low'} confidence
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
        <h4 className="font-medium text-gray-900 mb-3">Stripe Breakdown</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Gross</p>
            <p className="font-medium">{formatCurrency(pair.payout.total_gross)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Fees</p>
            <p className="font-medium">{formatCurrency(pair.payout.total_fees)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Refunds</p>
            <p className="font-medium">{formatCurrency(pair.payout.total_refunds)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Expected payout</p>
            <p className="font-medium">{formatCurrency(pair.payout.total_net)}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-900 mb-3">Bank Entry</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="font-medium">{pair.bankTransaction.date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Amount</p>
            <p className="font-medium">{formatCurrency(pair.bankTransaction.amount)}</p>
          </div>
        </div>
      </div>

      {hasMismatch && (
        <div className="border-t border-gray-200 pt-4">
          <div className="bg-orange-50 border border-orange-200 rounded p-3">
            <p className="text-sm text-orange-800">
              Difference: {formatCurrency(difference)}
            </p>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600">
          Match type: <span className="font-medium">{pair.matchType === 'exact' ? 'Exact' : 'Fuzzy'}</span>
          {' '}| Confidence score: <span className="font-medium">{(pair.confidenceScore * 100).toFixed(0)}%</span>
        </p>
      </div>
    </div>
  )
}

function UnmatchedBankList({ transactions }: any) {
  if (transactions.length === 0) {
    return <div className="text-center text-gray-600 py-8">No unmatched bank transactions</div>
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx: any, index: number) => (
        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
          <div className="flex-1">
            <p className="text-sm text-gray-900">{tx.date}</p>
            <p className="text-sm text-gray-600">{tx.description}</p>
          </div>
          <p className="font-medium text-gray-900">{formatCurrency(tx.amount)}</p>
        </div>
      ))}
    </div>
  )
}

function UnmatchedStripeList({ payouts }: any) {
  if (payouts.length === 0) {
    return <div className="text-center text-gray-600 py-8">No unmatched Stripe payouts</div>
  }

  return (
    <div className="space-y-2">
      {payouts.map((payout: any) => (
        <div key={payout.payout_id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{payout.payout_id}</p>
            <p className="text-sm text-gray-600">{payout.payout_date}</p>
          </div>
          <p className="font-medium text-gray-900">{formatCurrency(payout.total_net)}</p>
        </div>
      ))}
    </div>
  )
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount)
}
