import SeoLandingPage from '@/components/SeoLandingPage'
import { SEO_LANDING_RELATED } from '@/lib/seo'

export default function StripeReconciliationUkPage() {
  return (
    <SeoLandingPage
      title="Stripe Reconciliation Tool for UK Businesses – ReconcileFlow"
      metaDescription="UK-focused Stripe reconciliation tool. Supports UK date formats, GBP, and messy real-world CSVs. Audit-ready exports. 100% private, runs in your browser."
      h1="Stripe Reconciliation for UK Businesses"
      subtitle="DD/MM/YYYY dates, GBP amounts, and UK bank exports — reconciled locally in your browser."
      relatedLinks={[...SEO_LANDING_RELATED['stripe-reconciliation-uk']]}
      sections={[
        {
          title: 'Built for UK finance teams',
          paragraphs: [
            'UK bank and accounting exports commonly use DD/MM/YYYY dates and pound amounts with commas or currency symbols — ReconcileFlow normalises these formats before matching.',
            'Amounts are parsed as GBP whether they appear as £1,234.56, 1234.56, or (1234.56) for debits.',
            'The tool is designed for real-world CSVs from Stripe and UK high-street banks, not tidy demo files.',
          ],
        },
        {
          title: 'GDPR compliant by design',
          paragraphs: [
            'ReconcileFlow runs entirely in your browser. Files are read on your machine and never transmitted to our servers.',
            'We do not store uploads, require login, or use third-party analytics on your CSV contents.',
            'For UK businesses handling customer payment data, keeping reconciliation local reduces compliance scope and client data risk.',
          ],
        },
        {
          title: 'Audit-ready exports',
          paragraphs: [
            'Download reconciliation results as CSV with matched pairs, confidence scores, and exception lists.',
            'Use exports for client packs, year-end working papers, or internal sign-off before submitting to your accountant.',
            'Clear match explanations help you defend figures if HMRC or an auditor asks how Stripe ties to the bank.',
          ],
        },
        {
          title: 'Works with major UK banks',
          paragraphs: [
            'ReconcileFlow works with CSV exports from Barclays, HSBC, Lloyds, Monzo, Starling, and other UK banks that provide date and amount columns.',
            'Column detection suggests mappings for common header names; you can override them before running a match.',
            'If your bank uses a non-standard layout, manual column mapping still lets you reconcile without reformatting the entire statement.',
          ],
        },
      ]}
    />
  )
}
