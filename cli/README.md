# Environment Sync CLI

Sync environment variables across Netlify, Vercel, and local development with encryption and version control.

## Quick Install

```bash
cd cli
npm install
npm link
```

## Usage

```bash
# Sync to all platforms
env-sync sync --env production

# Pull from Netlify
env-sync pull netlify --env production

# Encrypt variables
env-sync encrypt --file .env.production

# Save version
env-sync version --save "Added new API keys"

# Switch environment
env-sync switch test
```

## Setup

1. Copy `.env-sync-config.example.json` to project root as `.env-sync-config.json`
2. Add your Netlify and Vercel credentials
3. Create `.env.production` and `.env.test` files
4. Run `env-sync sync`

## Documentation

See [ENV_SYNC_CLI.md](../ENV_SYNC_CLI.md) for complete documentation.

## Features

- 🔄 Multi-platform sync (Netlify, Vercel, Local)
- 🔐 AES-256-GCM encryption
- 📚 Version control with rollback
- 🔄 Environment switching
- 🛡️ Secure key management
- 💾 Automatic backups

## Commands

| Command | Description |
|---------|-------------|
| `sync` | Sync variables to platforms |
| `pull` | Pull variables from platform |
| `encrypt` | Encrypt environment files |
| `decrypt` | Decrypt environment files |
| `version` | Manage versions |
| `switch` | Switch active environment |
| `list` | List environments |

## Security

- Encryption keys stored in `.env-sync-key`
- Add to `.gitignore`
- Never commit unencrypted production files
- Use encrypted files for version control

## License

MIT
