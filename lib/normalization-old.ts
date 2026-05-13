import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

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
  
  for (const format of formats) {
    const parsed = dayjs(dateStr, format, true)
    if (parsed.isValid()) return parsed.toDate()
  }
  
  return new Date(dateStr)
}

export function getExplanation(payout: any, bank: any) {
  return {
    gross: payout.gross || 0,
    fees: payout.fees || 0,
    refunds: payout.refunds || 0,
    expected: payout.net || 0,
    actual: bank.amount || 0,
    difference: (bank.amount || 0) - (payout.net || 0),
  }
}

export interface MatchResult {
  matches: Array<{
    payout: any
    bank: any
    confidence: number
  }>
  unmatchedBank: any[]
  unmatchedPayouts: any[]
  summary: {
    totalMatchedAmount: number
    totalUnmatchedAmount: number
    transactionCount: number
  }
}

export function matchPayouts(bankTxns: any[], payouts: any[]): MatchResult {
  const matches = []
  const unmatchedBank = [...bankTxns]
  const unmatchedPayouts = [...payouts]

  for (const payout of payouts) {
    let bestMatch = null
    let bestScore = 0

    for (const bank of unmatchedBank) {
      const amountDiff = Math.abs(normalizeAmount(bank.amount) - normalizeAmount(payout.net))
      const dateDiff = Math.abs(
        new Date(bank.date).getTime() - new Date(payout.date).getTime()
      ) / (1000 * 60 * 60 * 24)

      const amountScore = amountDiff < 1 ? 1 : 0
      const dateScore = dateDiff <= 5 ? 1 - dateDiff / 5 : 0

      const score = amountScore + dateScore

      if (score > bestScore) {
        bestScore = score
        bestMatch = bank
      }
    }

    if (bestMatch && bestScore > 1.2) {
      matches.push({
        payout,
        bank: bestMatch,
        confidence: bestScore,
      })

      unmatchedBank.splice(unmatchedBank.indexOf(bestMatch), 1)
      unmatchedPayouts.splice(unmatchedPayouts.indexOf(payout), 1)
    }
  }

  return { matches, unmatchedBank, unmatchedPayouts }
}
