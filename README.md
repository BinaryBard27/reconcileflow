# ReconcileFlow

Stripe payout reconciliation tool for UK users. A browser-based tool that reconciles Stripe payouts with bank statements.

## Features

- Upload Stripe balance_transactions CSV and bank statement CSV
- Automatic column detection for bank statements
- Exact and fuzzy matching logic
- Detailed breakdown of matched transactions
- Summary of matched and unmatched amounts
- All processing runs in the browser (no backend required)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Papaparse for CSV parsing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Upload your Stripe balance_transactions CSV file
2. Upload your bank statement CSV file
3. Click "Reconcile" to process the files
4. View results in the tabs:
   - Matched: Shows successfully matched transactions
   - Unmatched Bank: Bank transactions without a match
   - Unmatched Stripe: Stripe payouts without a match

## CSV Format Requirements

### Stripe CSV
Required columns:
- payout_id
- created (date)
- amount
- fee
- net
- type

### Bank CSV
The tool auto-detects columns with common names:
- Date: date, Date, DATE, transaction_date, Transaction Date
- Description: description, Description, desc, Desc, details, Details
- Amount: amount, Amount, value, Value, debit, credit, Debit, Credit

## Matching Logic

### Exact Match
- Bank amount equals payout net amount
- Date difference within 5 days

### Fuzzy Match
- Absolute difference less than 1
- Date difference within 5 days

## Build for Production

```bash
npm run build
npm start
```
