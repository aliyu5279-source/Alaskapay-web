#!/bin/bash

# Automated version bumping script for iOS and Android
# Usage: ./scripts/bump-version.sh [patch|minor|major]

set -e

BUMP_TYPE=${1:-patch}
BUILD_NUMBER=${2:-$(date +%s)}

echo "🔢 Bumping version ($BUMP_TYPE)..."

# Bump npm version
npm version $BUMP_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "✅ New version: $NEW_VERSION"

# Update iOS version
echo "📱 Updating iOS version..."
cd ios/App
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $NEW_VERSION" App/Info.plist
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $BUILD_NUMBER" App/Info.plist
cd ../..

# Update Android version
echo "🤖 Updating Android version..."
cd android/app
sed -i.bak "s/versionName \".*\"/versionName \"$NEW_VERSION\"/" build.gradle
sed -i.bak "s/versionCode .*/versionCode $BUILD_NUMBER/" build.gradle
rm -f build.gradle.bak
cd ../..

# Update Capacitor config
echo "⚡ Updating Capacitor config..."
sed -i.bak "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" capacitor.config.ts
rm -f capacitor.config.ts.bak

echo "✅ Version bumped to $NEW_VERSION (build $BUILD_NUMBER)"
echo ""
echo "Next steps:"
echo "1. Review changes: git diff"
echo "2. Commit: git add . && git commit -m 'chore: bump version to $NEW_VERSION'"
echo "3. Tag: git tag v$NEW_VERSION"
echo "4. Push: git push && git push --tags"
