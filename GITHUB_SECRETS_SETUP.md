# GitHub Secrets Configuration Guide

## 🔐 Required Secrets

Para que o CI/CD funcione corretamente, você precisa configurar os seguintes secrets no GitHub:

### Vercel Configuration
```bash
# Configure via GitHub CLI
gh secret set VERCEL_TOKEN --body="your_vercel_token"
gh secret set VERCEL_ORG_ID --body="your_org_id"
gh secret set VERCEL_PROJECT_ID --body="your_project_id"
```

### Notifications (Optional)
```bash
gh secret set SLACK_WEBHOOK --body="your_slack_webhook"
gh secret set DISCORD_WEBHOOK --body="your_discord_webhook"
```

### Database (for production deployment)
```bash
gh secret set DATABASE_URL --body="your_database_url"
```

## 📋 How to Get These Values

### Vercel Token
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on Settings > Tokens
3. Create a new token with appropriate scope
4. Copy the token value

### Vercel Org ID & Project ID
1. In your project settings on Vercel
2. Go to Settings > General
3. Find "Project ID" and "Team ID" (Org ID)
4. Copy these values

### Slack Webhook (Optional)
1. Go to your Slack workspace
2. Create a new app or use existing one
3. Enable Incoming Webhooks
4. Create a webhook for your channel
5. Copy the webhook URL

## 🔧 Alternative: Manual Configuration

You can also configure secrets via GitHub web interface:

1. Go to your repository on GitHub
2. Click on Settings tab
3. In the left sidebar, click on "Secrets and variables" > "Actions"
4. Click "New repository secret"
5. Add each secret with its value

## ✅ Verification

After configuring secrets, verify they're working:

```bash
# Check if secrets are configured (this will show in Actions)
gh secret list

# Test deployment by pushing to develop branch
git checkout develop
git commit --allow-empty -m "test: trigger deployment"
git push origin develop
```

## 🚨 Security Notes

- Never commit secrets to the repository
- Use different values for staging and production
- Rotate secrets regularly
- Monitor secret usage in Actions logs
- Use least privilege principle for tokens

## 📞 Need Help?

If you encounter issues:
1. Check the Actions logs for error messages
2. Verify all secrets are configured correctly
3. Ensure Vercel project exists and is properly configured
4. Open an issue if problems persist
