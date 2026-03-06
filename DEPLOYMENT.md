# Deployment Guide - Water Consumption Analytics

## Quick Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project directory
cd water-consumption-analytics

# Deploy to production
vercel --prod
```

## Automatic GitHub Integration

The project is connected to Vercel via GitHub. Push commits to main branch to trigger automatic deployments:

```bash
git add .
git commit -m "Update"
git push origin main
```

## Local Development

```bash
npm install
npm run dev
```

Then visit http://localhost:3000

## Production URL

https://water-consumption-analytics-hks-projects-e97b216f.vercel.app
