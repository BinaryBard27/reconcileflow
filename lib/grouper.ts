import type { StripeTransaction, PayoutGroup } from '@/types'

export function groupPayouts(transactions: StripeTransaction[]): PayoutGroup[] {
  const groups = new Map<string, StripeTransaction[]>()

  for (const tx of transactions) {
    if (!tx.payout_id) continue

    if (!groups.has(tx.payout_id)) {
      groups.set(tx.payout_id, [])
    }
    groups.get(tx.payout_id)!.push(tx)
  }

  const payoutGroups: PayoutGroup[] = []

  for (const [payoutId, txs] of Array.from(groups.entries())) {
    const totalGross = txs.reduce((sum: number, tx: StripeTransaction) => sum + tx.amount, 0)
    const totalFees = txs.reduce((sum: number, tx: StripeTransaction) => sum + tx.fee, 0)
    const totalRefunds = txs
      .filter((tx) => tx.type === 'refund' || tx.type === 'refund.created')
      .reduce((sum: number, tx: StripeTransaction) => sum + Math.abs(tx.amount), 0)
    const totalNet = txs.reduce((sum: number, tx: StripeTransaction) => sum + tx.net, 0)
    const payoutDate = txs[0].created

    payoutGroups.push({
      payout_id: payoutId,
      payout_date: payoutDate,
      total_gross: totalGross,
      total_fees: totalFees,
      total_refunds: totalRefunds,
      total_net: totalNet,
      transactions: txs,
    })
  }

  return payoutGroups.sort((a, b) => new Date(b.payout_date).getTime() - new Date(a.payout_date).getTime())
}

export function getPayoutStats(transactions: any[], payoutGroups: PayoutGroup[], detectedColumns: string[]) {
  return {
    rowsParsed: transactions.length,
    payoutGroups: payoutGroups.length,
    detectedColumns,
  }
}
