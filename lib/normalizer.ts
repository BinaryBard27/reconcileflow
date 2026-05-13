export function normalizeDate(dateStr: string): string {
  if (!dateStr) return ''

  const cleaned = String(dateStr).trim()

  const ukFormat = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/
  const usFormat = /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/
  const isoFormat = /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/

  let day: number, month: number, year: number

  const ukMatch = cleaned.match(ukFormat)
  if (ukMatch) {
    day = parseInt(ukMatch[1], 10)
    month = parseInt(ukMatch[2], 10)
    year = parseInt(ukMatch[3], 10)
    if (year < 100) year += 2000
  } else {
    const date = new Date(cleaned)
    if (isNaN(date.getTime())) {
      return cleaned
    }
    day = date.getDate()
    month = date.getMonth() + 1
    year = date.getFullYear()
  }

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function normalizeAmount(amountStr: string | number): number {
  if (typeof amountStr === 'number') {
    return Math.abs(amountStr)
  }

  const cleaned = String(amountStr)
    .replace(/[£$€]/g, '')
    .replace(/,/g, '')
    .replace(/\s/g, '')
    .trim()

  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : Math.abs(parsed)
}

export function normalizeText(text: string): string {
  return String(text).trim().toLowerCase()
}

import { normalizeAmount as normalizeAmountNew, parseDate } from './normalization'

export function normalizeStripeTransaction(tx: any): any {
  return {
    ...tx,
    created: parseDate(tx.created),
    amount: normalizeAmountNew(tx.amount),
    fee: normalizeAmountNew(tx.fee),
    net: normalizeAmountNew(tx.net),
  }
}

export function normalizeBankTransaction(tx: any): any {
  return {
    ...tx,
    date: parseDate(tx.date),
    amount: normalizeAmountNew(tx.amount),
    description: tx.description ? tx.description.trim() : '',
  }
}
