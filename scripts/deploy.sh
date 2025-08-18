#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 Starting deployment process..."

# Verificar se está no branch correto
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Verificar se há mudanças não commitadas
if ! git diff-index --quiet HEAD --; then
    echo "❌ You have uncommitted changes. Please commit or stash them first."
    exit 1
fi

# Executar testes
echo "🧪 Running tests..."
npm run test:ci

# Verificar build
echo "🔨 Testing build..."
npm run build

# Verificar se Vercel CLI está disponível
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is required but not installed."
    echo "📦 Install with: npm install -g vercel"
    exit 1
fi

# Deploy baseado no branch
if [ "$CURRENT_BRANCH" = "main" ]; then
    echo "🚀 Deploying to PRODUCTION..."
    vercel --prod --confirm
    echo "✅ Production deployment completed!"
    echo "🌐 Visit: https://builtwithscience.com"
elif [ "$CURRENT_BRANCH" = "develop" ]; then
    echo "🧪 Deploying to STAGING..."
    vercel --confirm
    echo "✅ Staging deployment completed!"
    echo "🌐 Visit staging environment to test"
else
    echo "⚠️  Deploying preview from branch: $CURRENT_BRANCH"
    vercel --confirm
    echo "✅ Preview deployment completed!"
fi

echo "🎉 Deployment process finished!"

