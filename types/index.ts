export interface StripeTransaction {
  payout_id: string
  created: string
  amount: number
  fee: number
  net: number
  type: string
}

export interface BankTransaction {
  date: string
  description: string
  amount: number
}

export interface PayoutGroup {
  payout_id: string
  payout_date: string
  total_gross: number
  total_fees: number
  total_refunds: number
  total_net: number
  transactions: StripeTransaction[]
}

export interface MatchedPair {
  bankTransaction: BankTransaction
  payout: PayoutGroup
  matchType: 'exact' | 'fuzzy'
  confidence: 'high' | 'medium' | 'low'
  confidenceScore: number
}

export interface MatchResult {
  matches: Array<{
    payout: PayoutGroup
    bank: BankTransaction
    confidence: number
    explanation?: any
  }>
  needsReview: Array<{
    payout: PayoutGroup
    bank: BankTransaction
    confidence: number
    explanation?: any
  }>
  unmatchedBank: BankTransaction[]
  unmatchedPayouts: PayoutGroup[]
  summary: {
    totalMatchedAmount: number
    totalUnmatchedAmount: number
    transactionCount: number
    needsReviewCount: number
  }
}

export interface ColumnMapping {
  [key: string]: string
}

export interface ParseResult {
  data: any[]
  columns: string[]
  rowCount: number
}

export interface PayoutStats {
  rowsParsed: number
  payoutGroups: number
  detectedColumns: string[]
}

export interface BankStats {
  rowsParsed: number
  detectedColumns: string[]
}
