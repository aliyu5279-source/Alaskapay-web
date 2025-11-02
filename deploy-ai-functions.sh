#!/bin/bash

# Deploy AI Edge Functions to Supabase
# Run this script after Pro tier upgrade is active

echo "🚀 Deploying AI Edge Functions to Supabase..."
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "📦 Deploying ai-chat-assistant..."
supabase functions deploy ai-chat-assistant
if [ $? -eq 0 ]; then
    echo "✅ ai-chat-assistant deployed successfully"
else
    echo "❌ Failed to deploy ai-chat-assistant"
fi
echo ""

echo "📦 Deploying ai-categorize-transaction..."
supabase functions deploy ai-categorize-transaction
if [ $? -eq 0 ]; then
    echo "✅ ai-categorize-transaction deployed successfully"
else
    echo "❌ Failed to deploy ai-categorize-transaction"
fi
echo ""

echo "📦 Deploying ai-financial-insights..."
supabase functions deploy ai-financial-insights
if [ $? -eq 0 ]; then
    echo "✅ ai-financial-insights deployed successfully"
else
    echo "❌ Failed to deploy ai-financial-insights"
fi
echo ""

echo "📦 Deploying ai-fraud-detection..."
supabase functions deploy ai-fraud-detection
if [ $? -eq 0 ]; then
    echo "✅ ai-fraud-detection deployed successfully"
else
    echo "❌ Failed to deploy ai-fraud-detection"
fi
echo ""

echo "🎉 Deployment complete!"
echo ""
echo "Test your functions:"
echo "  curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/ai-chat-assistant \\"
echo "    -H 'Authorization: Bearer YOUR_ANON_KEY' \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"messages\":[{\"role\":\"user\",\"content\":\"Hello\"}]}'"
