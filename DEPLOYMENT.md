# ReconcileFlow Deployment Guide

## Overview
ReconcileFlow is a Next.js application for Stripe payout reconciliation with bank statements. The app processes files entirely client-side with no server-side data storage.

## Features
- ✅ Stripe payout matching with bank statements
- ✅ UK date format support (DD/MM/YYYY)
- ✅ Amount normalization for UK formats (£1,000.00)
- ✅ Confidence scoring and explanation layer
- ✅ Free CSV tools (Cleaner, Deduplicator, Date Formatter)
- ✅ SEO optimized with proper meta tags
- ✅ Responsive design with Tailwind CSS

## Prerequisites
- Node.js 18+ 
- npm or yarn
- Vercel/Netlify/ Railway for deployment

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to http://localhost:3000

## Testing

### Sample Data Files
Test with the provided sample files in `/test-data/`:

1. **Stripe Sample**: `test-data/stripe-sample.csv`
2. **Bank Sample**: `test-data/bank-sample.csv`
3. **Bank Messy**: `test-data/bank-messy.csv`

### Expected Results
- 3 matched payouts
- 0 unmatched bank entries
- 0 unmatched Stripe payouts

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Netlify
1. Build command: `npm run build`
2. Publish directory: `out`
3. Add environment variables if needed

### Railway
1. Connect GitHub repository
2. Railway auto-detects Next.js
3. Deploy with default settings

## Environment Variables
No environment variables required - all processing is client-side.

## Build Command
```bash
npm run build
```

## Start Command
```bash
npm start
```

## Performance
- All file processing happens in browser
- No server-side processing required
- Files are never uploaded to servers
- Instant matching with confidence scoring

## SEO Features
- Optimized meta titles and descriptions
- Open Graph tags for social sharing
- Twitter Card support
- XML sitemap
- Robots.txt
- Structured data ready

## Security
- No data collection or storage
- All processing client-side
- No authentication required
- GDPR compliant

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## File Size Limits
- Recommended: CSV files under 10MB
- Maximum: 50MB (browser dependent)

## Troubleshooting

### Common Issues
1. **Date parsing errors**: Ensure dates are in supported formats
2. **Amount mismatches**: Check for currency symbols and commas
3. **Memory issues**: Use smaller files for large datasets

### Debug Mode
Open browser console to see detailed matching logs and confidence scores.

## Support
For issues or questions, check the GitHub repository or contact support.

## License
MIT License - Free for commercial and personal use.
