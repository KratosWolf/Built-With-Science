# Deployment Guide

## Overview

Built With Science uses automated deployment with Vercel and GitHub Actions for a seamless CI/CD experience.

## Deployment Environments

### Staging Environment
- **Branch**: `develop`
- **URL**: `staging.builtwithscience.com`
- **Auto-deploy**: On push to develop branch
- **Purpose**: Testing and validation before production

### Production Environment
- **Branch**: `main`
- **URL**: `builtwithscience.com`
- **Auto-deploy**: On push to main branch
- **Purpose**: Live application for users

## Automatic Deployment

### Staging Deployment
1. Push changes to `develop` branch
2. CI/CD pipeline runs tests and security checks
3. If all checks pass, automatically deploys to staging
4. Staging URL is updated with latest changes

### Production Deployment
1. Create PR from `develop` to `main`
2. After PR approval and merge
3. CI/CD pipeline runs full test suite
4. Semantic release creates new version
5. Automatically deploys to production
6. Notifications sent to configured channels

## Manual Deployment

### Prerequisites
- Vercel CLI installed: `npm install -g vercel`
- Authenticated with Vercel: `vercel login`

### Commands
```bash
# Deploy to staging
vercel

# Deploy to production
vercel --prod

# Deploy specific branch
vercel --target production
```

## Environment Variables

### Required Variables
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com
```

### Optional Variables
```env
SENTRY_DSN=https://...
VERCEL_ANALYTICS_ID=your-analytics-id
SLACK_WEBHOOK=https://hooks.slack.com/...
```

### Setting Variables in Vercel
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable for appropriate environments

## GitHub Secrets

Configure these secrets in GitHub repository settings:

```bash
# Vercel Configuration
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id

# Notifications
SLACK_WEBHOOK=your_slack_webhook
DISCORD_WEBHOOK=your_discord_webhook

# Optional
NPM_TOKEN=your_npm_token (if publishing packages)
```

## Monitoring and Rollback

### Monitoring
- Vercel Analytics for performance metrics
- Sentry for error tracking
- GitHub Actions for deployment status

### Rollback Process
1. Identify the last working deployment
2. Revert commits if needed: `git revert <commit-hash>`
3. Push to trigger new deployment
4. Or use Vercel dashboard to rollback to previous deployment

## Troubleshooting

### Common Issues

**Build Fails**
- Check environment variables
- Verify all dependencies are installed
- Review build logs in GitHub Actions

**Deployment Fails**
- Verify Vercel secrets are configured
- Check Vercel project settings
- Review deployment logs

**Tests Fail in CI**
- Run tests locally first
- Check for environment-specific issues
- Verify test configuration

## Security Considerations

- Never commit sensitive data
- Use environment variables for secrets
- Regularly update dependencies
- Monitor security audit reports
- Use branch protection rules

## Performance Optimization

- Monitor bundle size
- Use Next.js Image optimization
- Implement proper caching strategies
- Monitor Core Web Vitals
- Use Vercel Analytics insights
