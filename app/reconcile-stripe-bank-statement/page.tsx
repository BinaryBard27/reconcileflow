import SeoLandingPage from '@/components/SeoLandingPage'
import { SEO_LANDING_RELATED } from '@/lib/seo'

export default function ReconcileStripeBankStatementPage() {
  return (
    <SeoLandingPage
      title="Reconcile Stripe with Bank Statement Online – ReconcileFlow"
      metaDescription="Match your Stripe CSV against your bank statement automatically. Detects fee discrepancies, missing payouts, and refunds. Free browser tool for UK accountants."
      h1="Reconcile Stripe with Your Bank Statement"
      subtitle="Upload two CSVs and see which payouts matched, which need review, and what is missing."
      relatedLinks={[...SEO_LANDING_RELATED['reconcile-stripe-bank-statement']]}
      sections={[
        {
          title: 'The problem with Stripe bank reconciliation',
          paragraphs: [
            'Your bank shows a single deposit — for example £4,218.47 from Stripe — but your sales reports show far more revenue for that period.',
            'Stripe has already deducted processing fees, bundled refunds, and sometimes held reserves before paying out, so the bank line will never match gross sales.',
            'Accountants and bookkeepers spend hours tracing each deposit back through Stripe exports, often finding small fee differences or payouts that landed on a different date.',
          ],
        },
        {
          title: 'What you need to reconcile',
          paragraphs: [
            'A Stripe balance transactions export (CSV from Dashboard → Balance → Transactions) with payout IDs, amounts, fees, and dates.',
            'A bank statement CSV with at least date and amount columns — most UK banks let you export transactions as CSV from online banking.',
            'ReconcileFlow maps columns automatically where possible and lets you adjust mappings before matching.',
          ],
        },
        {
          title: 'How ReconcileFlow matches them',
          paragraphs: [
            'Transactions are normalised for UK date formats and currency, then grouped into payout batches on the Stripe side.',
            'Each payout group is matched to bank lines using amount and date proximity, with a confidence score explaining why a match was suggested.',
            'Mismatches, missing payouts, and fee discrepancies are flagged so you can focus review time on the exceptions that matter.',
          ],
        },
        {
          title: 'Who this is for',
          paragraphs: [
            'Freelancers and sole traders who receive occasional Stripe payouts and want a quick sanity check before filing.',
            'Ecommerce and SaaS businesses with weekly or daily payouts who need repeatable month-end reconciliation.',
            'UK accountants and bookkeepers reconciling multiple clients without sending sensitive CSVs to yet another cloud vendor.',
          ],
        },
      ]}
    />
  )
}
