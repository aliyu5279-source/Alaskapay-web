#!/bin/bash
# Generate release notes from git commits

set -e

LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
CURRENT_VERSION=$1

if [ -z "$CURRENT_VERSION" ]; then
  echo "Usage: $0 <version>"
  exit 1
fi

echo "# Release Notes - v$CURRENT_VERSION"
echo ""
echo "**Release Date:** $(date +%Y-%m-%d)"
echo ""

# Get commits since last tag
if [ -z "$LAST_TAG" ]; then
  COMMITS=$(git log --pretty=format:"%h|%s|%an|%ad" --date=short)
else
  COMMITS=$(git log $LAST_TAG..HEAD --pretty=format:"%h|%s|%an|%ad" --date=short)
fi

# Categorize commits
echo "## 🚀 Features"
echo "$COMMITS" | grep -i "feat:" | while IFS='|' read hash msg author date; do
  echo "- ${msg#*: } (${hash})"
done
echo ""

echo "## 🐛 Bug Fixes"
echo "$COMMITS" | grep -i "fix:" | while IFS='|' read hash msg author date; do
  echo "- ${msg#*: } (${hash})"
done
echo ""

echo "## 📚 Documentation"
echo "$COMMITS" | grep -i "docs:" | while IFS='|' read hash msg author date; do
  echo "- ${msg#*: } (${hash})"
done
echo ""

echo "## 🔧 Other Changes"
echo "$COMMITS" | grep -v -i "feat:\|fix:\|docs:" | while IFS='|' read hash msg author date; do
  echo "- $msg (${hash})"
done
