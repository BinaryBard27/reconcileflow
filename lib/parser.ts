import Papa from 'papaparse'
import type { ParseResult, ColumnMapping } from '@/types'

export function parseCSV(csvText: string): ParseResult {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  })

  if (result.errors.length > 0) {
    throw new Error(`CSV parsing error: ${result.errors[0].message}`)
  }

  const columns = result.meta.fields || []
  const data = result.data as any[]

  return {
    data,
    columns,
    rowCount: data.length,
  }
}

export function parseStripeCSV(csvText: string, mapping: ColumnMapping): any[] {
  const result = parseCSV(csvText)
  const transactions: any[] = []

  const requiredFields = ['payout_id', 'created', 'amount', 'fee', 'net', 'type']
  const missingFields = requiredFields.filter(field => !mapping[field])

  if (missingFields.length > 0) {
    throw new Error(`Missing required Stripe column mappings: ${missingFields.join(', ')}`)
  }

  for (const row of result.data) {
    const payoutId = row[mapping.payout_id]
    const created = row[mapping.created]
    const amount = row[mapping.amount]
    const fee = row[mapping.fee]
    const net = row[mapping.net]
    const type = row[mapping.type]

    if (!payoutId || !created || amount === undefined || fee === undefined || net === undefined || !type) {
      continue
    }

    transactions.push({
      payout_id: payoutId,
      created,
      amount: parseFloat(String(amount)),
      fee: parseFloat(String(fee)),
      net: parseFloat(String(net)),
      type,
    })
  }

  return transactions
}

export function parseBankCSV(csvText: string, mapping: ColumnMapping): any[] {
  const result = parseCSV(csvText)
  const transactions: any[] = []

  const requiredFields = ['date', 'amount']
  const missingFields = requiredFields.filter(field => !mapping[field])

  if (missingFields.length > 0) {
    throw new Error(`Missing required bank column mappings: ${missingFields.join(', ')}`)
  }

  for (const row of result.data) {
    const date = row[mapping.date]
    const amount = row[mapping.amount]
    const description = mapping.description ? row[mapping.description] : ''

    if (!date || amount === undefined) {
      continue
    }

    transactions.push({
      date,
      amount: parseFloat(String(amount)),
      description: description || '',
    })
  }

  return transactions
}

export function detectStripeColumns(columns: string[]): ColumnMapping {
  const mapping: ColumnMapping = {}

  const payoutIdKeys = ['payout_id', 'payout id', 'Payout ID', 'payout']
  const createdKeys = ['created', 'Created', 'date', 'Date', 'created_utc']
  const amountKeys = ['amount', 'Amount', 'gross', 'Gross']
  const feeKeys = ['fee', 'Fee', 'reporting_category']
  const netKeys = ['net', 'Net', 'amount_net']
  const typeKeys = ['type', 'Type', 'reporting_category']

  mapping.payout_id = findBestMatch(columns, payoutIdKeys)
  mapping.created = findBestMatch(columns, createdKeys)
  mapping.amount = findBestMatch(columns, amountKeys)
  mapping.fee = findBestMatch(columns, feeKeys)
  mapping.net = findBestMatch(columns, netKeys)
  mapping.type = findBestMatch(columns, typeKeys)

  return mapping
}

export function detectBankColumns(columns: string[]): ColumnMapping {
  const mapping: ColumnMapping = {}

  const dateKeys = ['date', 'Date', 'DATE', 'transaction_date', 'Transaction Date', 'transaction date', 'value date']
  const amountKeys = ['amount', 'Amount', 'AMOUNT', 'value', 'Value', 'debit', 'credit', 'Debit', 'Credit', 'in', 'out']
  const descKeys = ['description', 'Description', 'DESCRIPTION', 'desc', 'Desc', 'transaction_description', 'details', 'Details', 'narrative', 'Narrative']

  mapping.date = findBestMatch(columns, dateKeys)
  mapping.amount = findBestMatch(columns, amountKeys)
  mapping.description = findBestMatch(columns, descKeys)

  return mapping
}

function findBestMatch(columns: string[], candidates: string[]): string {
  for (const candidate of candidates) {
    const match = columns.find((col) => col.toLowerCase() === candidate.toLowerCase())
    if (match) return match
  }
  return candidates[0]
}
