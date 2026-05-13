// Simple date and amount normalization without external dependencies

export function normalizeAmount(value: string | number): number {
  if (typeof value === 'number') return value

  return parseFloat(
    value
      .replace(/,/g, '')
      .replace(/£/g, '')
      .replace(/\$/g, '')
      .replace(/€/g, '')
      .replace(/¥/g, '')
      .trim()
  )
}

export function parseDate(dateStr: string): Date {
  const formats = [
    'DD/MM/YYYY', 
    'YYYY-MM-DD', 
    'MM/DD/YYYY',
    'DD-MM-YYYY',
    'MM-DD-YYYY',
    'D/M/YYYY',
    'M/D/YYYY'
  ]
  
  // Try to parse different date formats manually
  const cleaned = dateStr.trim()
  
  // Try DD/MM/YYYY format
  const ddmmyy = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/)
  if (ddmmyy) {
    const day = parseInt(ddmmyy[1], 10)
    const month = parseInt(ddmmyy[2], 10)
    let year = parseInt(ddmmyy[3], 10)
    if (year < 100) year += 2000
    return new Date(year, month - 1, day)
  }
  
  // Try YYYY-MM-DD format
  const yyyymmdd = cleaned.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/)
  if (yyyymmdd) {
    const year = parseInt(yyyymmdd[1], 10)
    const month = parseInt(yyyymmdd[2], 10)
    const day = parseInt(yyyymmdd[3], 10)
    return new Date(year, month - 1, day)
  }
  
  // Try MM/DD/YYYY format
  const mmddyy = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/)
  if (mmddyy) {
    const month = parseInt(mmddyy[1], 10)
    const day = parseInt(mmddyy[2], 10)
    let year = parseInt(mmddyy[3], 10)
    if (year < 100) year += 2000
    return new Date(year, month - 1, day)
  }
  
  // Fallback to native Date parsing
  return new Date(cleaned)
}

export function getExplanation(payout: any, bank: any) {
  return {
    gross: payout.total_gross || 0,
    fees: payout.total_fees || 0,
    refunds: payout.total_refunds || 0,
    expected: payout.total_net || 0,
    actual: bank.amount || 0,
    difference: (bank.amount || 0) - (payout.total_net || 0),
  }
}

export interface MatchResult {
  matches: Array<{
    payout: any
    bank: any
    confidence: number
    explanation?: any
  }>
  needsReview: Array<{
    payout: any
    bank: any
    confidence: number
    explanation?: any
  }>
  unmatchedBank: any[]
  unmatchedPayouts: any[]
  summary: {
    totalMatchedAmount: number
    totalUnmatchedAmount: number
    transactionCount: number
    needsReviewCount: number
  }
}

export function matchPayouts(bankTxns: any[], payouts: any[]): MatchResult {
  const matches = []
  const needsReview = []
  const unmatchedBank = [...bankTxns]
  const unmatchedPayouts = [...payouts]

  // Create maps for performance optimization
  const bankMap = new Map()
  for (const txn of bankTxns) {
    const key = Math.round(normalizeAmount(txn.amount))
    if (!bankMap.has(key)) bankMap.set(key, [])
    bankMap.get(key).push(txn)
  }

  const payoutMap = new Map()
  for (const payout of payouts) {
    const key = Math.round(normalizeAmount(payout.total_net))
    if (!payoutMap.has(key)) payoutMap.set(key, [])
    payoutMap.get(key).push(payout)
  }

  const STRICT_AMOUNT_TOLERANCE = 0.5

  for (const payout of payouts) {
    let bestMatch = null
    let bestScore = 0

    // Only compare with nearby amounts for performance
    const nearbyBanks = []
    const payoutAmount = Math.round(normalizeAmount(payout.total_net))
    
    for (let i = payoutAmount - 2; i <= payoutAmount + 2; i++) {
      if (bankMap.has(i)) {
        nearbyBanks.push(...bankMap.get(i))
      }
    }

    for (const bank of nearbyBanks) {
      if (!unmatchedBank.includes(bank)) continue

      const amountDiff = Math.abs(normalizeAmount(bank.amount) - normalizeAmount(payout.total_net))
      const dateDiff = Math.abs(
        new Date(bank.date).getTime() - new Date(payout.payout_date).getTime()
      ) / (1000 * 60 * 60 * 24)

      const amountScore = amountDiff < 1 ? 1 : 0
      const dateScore = dateDiff <= 5 ? 1 - dateDiff / 5 : 0

      const score = amountScore + dateScore

      if (score > bestScore) {
        bestScore = score
        bestMatch = bank
      }
    }

    // Apply strict guardrails
    if (bestMatch && bestScore > 1.6 && Math.abs(normalizeAmount(bestMatch.amount) - normalizeAmount(payout.total_net)) < STRICT_AMOUNT_TOLERANCE) {
      // High confidence match
      matches.push({
        payout,
        bank: bestMatch,
        confidence: bestScore,
      })

      unmatchedBank.splice(unmatchedBank.indexOf(bestMatch), 1)
      unmatchedPayouts.splice(unmatchedPayouts.indexOf(payout), 1)
    } else if (bestMatch && bestScore > 0.8 && bestScore <= 1.6) {
      // Needs review
      needsReview.push({
        payout,
        bank: bestMatch,
        confidence: bestScore,
      })
    }
    // Low confidence matches remain unmatched
  }

  const totalMatchedAmount = matches.reduce((sum, m) => sum + normalizeAmount(m.payout.total_net), 0)
  const totalUnmatchedAmount = 
    unmatchedBank.reduce((sum, tx) => sum + normalizeAmount(tx.amount), 0) +
    unmatchedPayouts.reduce((sum, p) => sum + normalizeAmount(p.total_net), 0)

  return { 
    matches, 
    needsReview,
    unmatchedBank, 
    unmatchedPayouts,
    summary: {
      totalMatchedAmount,
      totalUnmatchedAmount,
      transactionCount: matches.length,
      needsReviewCount: needsReview.length,
    }
  }
}
