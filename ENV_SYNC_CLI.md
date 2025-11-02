# Environment Variables Sync CLI Tool

A powerful CLI tool for syncing environment variables across Netlify, Vercel, and local development environments with encryption and version control.

## Features

✨ **Multi-Platform Sync**: Sync variables between Netlify, Vercel, and local environments
🔐 **Encryption**: AES-256-GCM encryption for sensitive keys
📚 **Version Control**: Track and restore variable changes
🔄 **Environment Switching**: Quickly switch between test/production configurations
🛡️ **Secure**: Never commit sensitive data to git

## Installation

### Local Installation

```bash
cd cli
npm install
npm link
```

### Global Installation

```bash
npm install -g @alaskapay/env-sync
```

## Quick Start

### 1. Initialize Configuration

Create `.env-sync-config.json` in your project root:

```json
{
  "netlify": {
    "siteId": "your-site-id",
    "token": "your-netlify-token"
  },
  "vercel": {
    "projectId": "your-project-id",
    "token": "your-vercel-token"
  }
}
```

### 2. Create Environment Files

```bash
# Production variables
touch .env.production

# Test variables
touch .env.test
```

### 3. Sync to All Platforms

```bash
env-sync sync --env production
```

## Commands

### Sync Variables

Sync variables to all platforms:

```bash
env-sync sync --env production
env-sync sync --env test --platforms netlify,vercel
```

Options:
- `-e, --env <environment>`: Environment (test/production)
- `-p, --platforms <platforms>`: Comma-separated platforms (netlify,vercel,local)

### Pull Variables

Pull variables from a platform:

```bash
env-sync pull netlify --env production
env-sync pull vercel --env test
```

### Encrypt Variables

Encrypt sensitive environment files:

```bash
env-sync encrypt --file .env.production
```

This creates `.env.production.encrypted` with AES-256-GCM encryption.

### Decrypt Variables

Decrypt encrypted files:

```bash
env-sync decrypt --file .env.production.encrypted
```

### Version Control

Save current version:

```bash
env-sync version --save "Added Stripe keys"
```

List all versions:

```bash
env-sync version --list
```

Restore a version:

```bash
env-sync version --restore 1704067200000
```

### Switch Environment

Switch active environment:

```bash
env-sync switch production
env-sync switch test
```

List available environments:

```bash
env-sync list
```

## Configuration

### Netlify Setup

1. Get your site ID from Netlify dashboard
2. Generate a personal access token: https://app.netlify.com/user/applications
3. Add to `.env-sync-config.json` or set `NETLIFY_AUTH_TOKEN` environment variable

### Vercel Setup

1. Get your project ID from Vercel dashboard
2. Generate a token: https://vercel.com/account/tokens
3. Add to `.env-sync-config.json` or set `VERCEL_TOKEN` environment variable

## Encryption Details

- **Algorithm**: AES-256-GCM
- **Key Storage**: `.env-sync-key` (auto-generated)
- **Security**: 256-bit keys, 128-bit IV, authentication tags

⚠️ **Important**: Add `.env-sync-key` to `.gitignore` and keep it secure!

## Version Control

Versions are stored in `.env-versions/` directory with timestamps:

```
.env-versions/
  ├── 1704067200000.json
  ├── 1704153600000.json
  └── 1704240000000.json
```

Each version includes:
- Unique ID (timestamp)
- Commit message
- All environment files
- Timestamp

## Best Practices

### 1. Use Separate Files

```
.env.production    # Production variables
.env.test          # Test/staging variables
.env.development   # Local development
.env               # Active environment (gitignored)
```

### 2. Version Before Major Changes

```bash
env-sync version --save "Before adding payment gateway"
# Make changes
env-sync sync --env production
```

### 3. Encrypt Sensitive Files

```bash
# Encrypt before committing
env-sync encrypt --file .env.production

# Commit encrypted file
git add .env.production.encrypted
git commit -m "Update production config"
```

### 4. Regular Backups

```bash
# Backups are automatic when switching environments
env-sync switch production
# Creates backup in .env-backups/
```

## Workflow Examples

### Deploy New Feature

```bash
# 1. Save current state
env-sync version --save "Before feature X"

# 2. Pull latest from production
env-sync pull netlify --env production

# 3. Add new variables to .env.production
echo "NEW_API_KEY=abc123" >> .env.production

# 4. Sync to all platforms
env-sync sync --env production

# 5. Switch local to production
env-sync switch production
```

### Rollback Changes

```bash
# 1. List versions
env-sync version --list

# 2. Restore previous version
env-sync version --restore 1704067200000

# 3. Sync restored version
env-sync sync --env production
```

### Switch Between Environments

```bash
# Work on test environment
env-sync switch test
npm run dev

# Switch to production for testing
env-sync switch production
npm run build
```

## Security Considerations

### What to Commit

✅ **Safe to commit**:
- `.env-sync-config.json` (without tokens)
- `.env.example`
- `*.env.encrypted` files

❌ **Never commit**:
- `.env`
- `.env.production`
- `.env.test`
- `.env-sync-key`
- `.env-backups/`
- `.env-versions/`

### Recommended .gitignore

```gitignore
# Environment files
.env
.env.local
.env.production
.env.test
.env.development

# Encryption key
.env-sync-key

# Backups and versions
.env-backups/
.env-versions/
.env-current
```

## Troubleshooting

### Authentication Errors

```bash
# Set tokens as environment variables
export NETLIFY_AUTH_TOKEN=your_token
export VERCEL_TOKEN=your_token

# Or add to config file
```

### Missing Variables

```bash
# Pull from platform to verify
env-sync pull netlify --env production

# Check version history
env-sync version --list
```

### Encryption Key Lost

If you lose `.env-sync-key`:
1. A new key will be generated
2. Previous encrypted files cannot be decrypted
3. Re-encrypt files with new key

## Advanced Usage

### Custom Sync Script

```bash
#!/bin/bash
# sync-all.sh

echo "🔄 Syncing all environments..."

env-sync version --save "Auto-backup $(date)"
env-sync sync --env production --platforms netlify,vercel
env-sync sync --env test --platforms netlify,vercel

echo "✅ Sync complete!"
```

### CI/CD Integration

```yaml
# .github/workflows/sync-env.yml
name: Sync Environment Variables

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to sync'
        required: true
        default: 'production'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install CLI
        run: |
          cd cli
          npm install
          npm link
      
      - name: Decrypt variables
        run: env-sync decrypt --file .env.${{ github.event.inputs.environment }}.encrypted
        env:
          ENV_SYNC_KEY: ${{ secrets.ENV_SYNC_KEY }}
      
      - name: Sync to platforms
        run: env-sync sync --env ${{ github.event.inputs.environment }}
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

## Support

For issues or questions:
- GitHub Issues: [your-repo/issues]
- Documentation: [your-docs-url]

## License

MIT License - see LICENSE file for details
