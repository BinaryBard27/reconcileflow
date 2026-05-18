import SeoLandingPage from '@/components/SeoLandingPage'
import { SEO_LANDING_RELATED } from '@/lib/seo'

export default function StripePayoutReconciliationToolPage() {
  return (
    <SeoLandingPage
      title="Stripe Payout Reconciliation Tool – ReconcileFlow"
      metaDescription="Automatically match Stripe payouts with your bank statement in 60 seconds. Free, private, runs entirely in your browser. No data uploaded. Built for UK businesses."
      h1="Stripe Payout Reconciliation Tool"
      subtitle="Match Stripe payouts to bank deposits automatically — no spreadsheets, no uploads."
      relatedLinks={[...SEO_LANDING_RELATED['stripe-payout-reconciliation-tool']]}
      sections={[
        {
          title: 'What is Stripe payout reconciliation?',
          paragraphs: [
            'Stripe payout reconciliation is the process of proving that each lump-sum payout in your bank account matches the underlying charges, refunds, and fees in Stripe.',
            'Without it, finance teams chase mismatched totals in spreadsheets — hidden fees go unnoticed, refunds get double-counted, and month-end close takes hours longer than it should.',
            'ReconcileFlow automates that matching so you can trust your numbers in minutes instead of rebuilding pivot tables every week.',
          ],
        },
        {
          title: 'Why reconciliation is hard',
          paragraphs: [
            'Stripe nets processing fees, refunds, and chargebacks before each payout hits your bank, so the deposit amount rarely equals gross revenue on a single line.',
            'Timing differences make it worse: a payout initiated on Friday may land on Monday, while your bank statement uses value dates.',
            'Exported CSVs are messy — column names vary, amounts use different formats, and bundled refunds are easy to miss when reconciling manually.',
          ],
        },
        {
          title: 'How ReconcileFlow works',
          paragraphs: [
            'Upload your Stripe balance transactions CSV and your bank statement CSV. ReconcileFlow parses both files locally in your browser.',
            'Payouts are grouped and matched to bank deposits with confidence scoring, so high-confidence matches can be accepted quickly and uncertain ones are flagged for review.',
            'Export matched results and exceptions as CSV for your accountant, audit trail, or HMRC records.',
          ],
        },
        {
          title: 'Why browser-based matters',
          paragraphs: [
            'Your financial data never leaves your device — nothing is uploaded to a server, stored in a database, or shared with third parties.',
            'That makes ReconcileFlow GDPR-friendly by design: no subprocessors, no data processing agreement required for the tool itself.',
            'No account is needed. Open the page, reconcile, and download results — ideal for freelancers, ecommerce sellers, and UK finance teams handling sensitive client data.',
          ],
        },
      ]}
    />
  )
}
