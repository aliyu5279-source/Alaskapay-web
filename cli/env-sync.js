#!/usr/bin/env node

const { Command } = require('commander');
const { syncToNetlify, syncFromNetlify } = require('./lib/netlify-sync');
const { syncToVercel, syncFromVercel } = require('./lib/vercel-sync');
const { syncToLocal, loadLocal } = require('./lib/local-sync');
const { encryptVars, decryptVars } = require('./lib/encryption');
const { saveVersion, listVersions, restoreVersion } = require('./lib/version-control');
const { switchEnvironment, listEnvironments } = require('./lib/environment-manager');
const chalk = require('chalk');

const program = new Command();

program
  .name('env-sync')
  .description('Sync environment variables across platforms')
  .version('1.0.0');

program
  .command('sync')
  .description('Sync variables to all platforms')
  .option('-e, --env <environment>', 'Environment (test/production)', 'production')
  .option('-p, --platforms <platforms>', 'Platforms (netlify,vercel,local)', 'netlify,vercel,local')
  .action(async (options) => {
    console.log(chalk.blue('🔄 Syncing environment variables...'));
    const platforms = options.platforms.split(',');
    
    for (const platform of platforms) {
      try {
        if (platform === 'netlify') await syncToNetlify(options.env);
        if (platform === 'vercel') await syncToVercel(options.env);
        if (platform === 'local') await syncToLocal(options.env);
        console.log(chalk.green(`✓ Synced to ${platform}`));
      } catch (error) {
        console.error(chalk.red(`✗ Failed to sync to ${platform}: ${error.message}`));
      }
    }
  });

program
  .command('pull')
  .description('Pull variables from platform')
  .argument('<platform>', 'Platform to pull from (netlify/vercel)')
  .option('-e, --env <environment>', 'Environment', 'production')
  .action(async (platform, options) => {
    console.log(chalk.blue(`📥 Pulling from ${platform}...`));
    try {
      if (platform === 'netlify') await syncFromNetlify(options.env);
      if (platform === 'vercel') await syncFromVercel(options.env);
      console.log(chalk.green('✓ Variables pulled successfully'));
    } catch (error) {
      console.error(chalk.red(`✗ Failed: ${error.message}`));
    }
  });

program
  .command('encrypt')
  .description('Encrypt sensitive variables')
  .option('-f, --file <file>', 'File to encrypt', '.env')
  .action(async (options) => {
    await encryptVars(options.file);
    console.log(chalk.green('✓ Variables encrypted'));
  });

program
  .command('decrypt')
  .description('Decrypt variables')
  .option('-f, --file <file>', 'Encrypted file', '.env.encrypted')
  .action(async (options) => {
    await decryptVars(options.file);
    console.log(chalk.green('✓ Variables decrypted'));
  });

program
  .command('version')
  .description('Manage variable versions')
  .option('-s, --save <message>', 'Save current version')
  .option('-l, --list', 'List versions')
  .option('-r, --restore <version>', 'Restore version')
  .action(async (options) => {
    if (options.save) await saveVersion(options.save);
    if (options.list) await listVersions();
    if (options.restore) await restoreVersion(options.restore);
  });

program
  .command('switch')
  .description('Switch environment')
  .argument('<environment>', 'Environment (test/production)')
  .action(async (environment) => {
    await switchEnvironment(environment);
    console.log(chalk.green(`✓ Switched to ${environment}`));
  });

program
  .command('list')
  .description('List available environments')
  .action(async () => {
    await listEnvironments();
  });

program.parse();
