import { PayoutGroup, MatchResult } from '@/types'
import { normalizeAmount, matchPayouts, getExplanation } from './normalization'

export function matchTransactions(payouts: PayoutGroup[], bankTransactions: any[]): MatchResult {
  const bankTxns = bankTransactions.map(bank => ({
    ...bank,
    amount: normalizeAmount(bank.amount)
  }))
  
  const payoutTxns = payouts.map(payout => ({
    ...payout,
    total_net: normalizeAmount(payout.total_net || 0),
    payout_date: new Date(payout.payout_date || new Date())
  }))

  const result = matchPayouts(bankTxns, payoutTxns)
  
  // Add explanation layer
  const matchesWithExplanation = result.matches.map(match => ({
    ...match,
    explanation: getExplanation(match.payout, match.bank)
  }))

  return {
    ...result,
    matches: matchesWithExplanation
  }
}
