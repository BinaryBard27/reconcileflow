export const SITE_URL = 'https://reconcileflow.com'

export const SEO_PAGES = {
  home: {
    title: 'ReconcileFlow – Stripe Payout Reconciliation in 60 Seconds',
    description:
      'Automatically reconcile Stripe payouts with your bank statement. Detects mismatches, missing payouts, and fee discrepancies. Free, private, runs entirely in your browser.',
  },
  tools: {
    title: 'Free CSV Tools – ReconcileFlow',
    description:
      'Free online CSV tools for cleaning, deduplicating, formatting, and converting data. Secure, browser-based processing with no uploads.',
  },
  reconcile: {
    title: 'Stripe Reconciliation Tool – ReconcileFlow',
    description:
      'Match Stripe payouts with your bank statement CSV. Confidence scoring, fee detection, and audit-ready exports. Runs entirely in your browser.',
  },
  'clean-csv': {
    title: 'CSV Cleaner – ReconcileFlow',
    description: 'Clean and format CSV data in your browser. Trim whitespace, remove empty cells, and download results instantly.',
  },
  'deduplicate-csv': {
    title: 'CSV Deduplication Tool – ReconcileFlow',
    description: 'Remove duplicate rows from CSV files online. Free, private, and runs entirely in your browser.',
  },
  'date-formatter': {
    title: 'CSV Date Formatter – ReconcileFlow',
    description: 'Format dates in CSV files including UK DD/MM/YYYY formats. Convert and export in seconds, no upload required.',
  },
  'merge-csv': {
    title: 'Merge CSV Files – ReconcileFlow',
    description: 'Combine multiple CSV files into one. Free browser-based tool with no data uploaded to servers.',
  },
  'split-csv': {
    title: 'Split CSV Files – ReconcileFlow',
    description: 'Split large CSV files into smaller chunks by row count. Fast, free, and private in-browser processing.',
  },
  'sort-csv': {
    title: 'Sort CSV Online – ReconcileFlow',
    description: 'Sort CSV rows by any column ascending or descending. Free tool that runs entirely in your browser.',
  },
  'filter-csv': {
    title: 'Filter CSV Online – ReconcileFlow',
    description: 'Filter CSV rows by column values. Process files locally with no signup or server upload.',
  },
  'compare-csv': {
    title: 'Compare CSV Files – ReconcileFlow',
    description: 'Compare two CSV files and find differences. Free, private comparison tool for spreadsheets and exports.',
  },
  'join-csv': {
    title: 'Join CSV Files – ReconcileFlow',
    description: 'Join two CSV files on a shared column. VLOOKUP-style merge in your browser with instant download.',
  },
  'csv-to-json': {
    title: 'CSV to JSON Converter – ReconcileFlow',
    description: 'Convert CSV files to JSON online. Free, fast, and private — your data never leaves the browser.',
  },
  'json-to-csv': {
    title: 'JSON to CSV Converter – ReconcileFlow',
    description: 'Convert JSON data to CSV format instantly. Free browser tool with no account required.',
  },
  'csv-to-excel': {
    title: 'CSV to Excel Converter – ReconcileFlow',
    description: 'Convert CSV files to Excel (.xlsx) in your browser. Free, private, no upload to servers.',
  },
  'excel-to-csv': {
    title: 'Excel to CSV Converter – ReconcileFlow',
    description: 'Convert Excel spreadsheets to CSV online. Supports .xlsx files with client-side processing only.',
  },
  'format-csv': {
    title: 'CSV Formatter – ReconcileFlow',
    description: 'Format and standardise CSV column data. Free online tool with browser-only processing.',
  },
  'validate-csv': {
    title: 'CSV Validator – ReconcileFlow',
    description: 'Validate CSV structure and detect parsing issues. Free diagnostic tool for messy real-world exports.',
  },
  'csv-stats': {
    title: 'CSV Statistics – ReconcileFlow',
    description: 'Analyse CSV files with row counts, column stats, and data summaries. Runs entirely in your browser.',
  },
  'sample-csv': {
    title: 'CSV Sample Generator – ReconcileFlow',
    description: 'Generate sample CSV files for testing and demos. Free tool with instant download.',
  },
  'aggregate-csv': {
    title: 'CSV Aggregate Tool – ReconcileFlow',
    description: 'Aggregate and summarise CSV data by column. Group sums, counts, and totals in your browser.',
  },
  'pivot-csv': {
    title: 'CSV Pivot Table – ReconcileFlow',
    description: 'Create pivot-style summaries from CSV data. Free browser tool for quick data analysis.',
  },
  'transpose-csv': {
    title: 'Transpose CSV – ReconcileFlow',
    description: 'Transpose CSV rows and columns online. Swap axes instantly with no server upload.',
  },
} as const

export type SeoPageKey = keyof typeof SEO_PAGES

export const SEO_LANDING_RELATED = {
  'stripe-payout-reconciliation-tool': [
    {
      href: '/reconcile-stripe-bank-statement',
      title: 'Reconcile Stripe with Bank Statement',
      description: 'Match Stripe CSV exports against your bank statement automatically.',
    },
    {
      href: '/stripe-reconciliation-uk',
      title: 'Stripe Reconciliation for UK',
      description: 'UK date formats, GBP, and audit-ready exports for finance teams.',
    },
  ],
  'reconcile-stripe-bank-statement': [
    {
      href: '/stripe-payout-reconciliation-tool',
      title: 'Stripe Payout Reconciliation Tool',
      description: 'Automatically match Stripe payouts with bank deposits in 60 seconds.',
    },
    {
      href: '/stripe-reconciliation-uk',
      title: 'Stripe Reconciliation for UK',
      description: 'Built for UK businesses with GDPR-friendly browser processing.',
    },
  ],
  'stripe-reconciliation-uk': [
    {
      href: '/stripe-payout-reconciliation-tool',
      title: 'Stripe Payout Reconciliation Tool',
      description: 'Free tool to reconcile Stripe payouts with confidence scoring.',
    },
    {
      href: '/reconcile-stripe-bank-statement',
      title: 'Reconcile Stripe with Bank Statement',
      description: 'Detect fee discrepancies and missing payouts automatically.',
    },
  ],
} as const
