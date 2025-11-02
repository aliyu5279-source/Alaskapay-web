const fs = require('fs').promises;
const chalk = require('chalk');
const { backupLocal } = require('./local-sync');

async function switchEnvironment(environment) {
  const validEnvs = ['test', 'production', 'development'];
  
  if (!validEnvs.includes(environment)) {
    throw new Error(`Invalid environment. Use: ${validEnvs.join(', ')}`);
  }
  
  // Backup current .env
  await backupLocal();
  
  const sourceFile = environment === 'test' ? '.env.test' : 
                     environment === 'production' ? '.env.production' : 
                     '.env.development';
  
  try {
    const content = await fs.readFile(sourceFile, 'utf8');
    await fs.writeFile('.env', content);
    
    // Update current environment marker
    const config = {
      currentEnvironment: environment,
      switchedAt: new Date().toISOString()
    };
    
    await fs.writeFile('.env-current', JSON.stringify(config, null, 2));
    
    console.log(chalk.green(`✓ Switched to ${environment} environment`));
  } catch (error) {
    throw new Error(`Environment file ${sourceFile} not found`);
  }
}

async function listEnvironments() {
  console.log(chalk.blue('\n🌍 Available Environments:\n'));
  
  const envFiles = {
    'test': '.env.test',
    'production': '.env.production',
    'development': '.env.development'
  };
  
  let current = null;
  try {
    const currentConfig = await fs.readFile('.env-current', 'utf8');
    current = JSON.parse(currentConfig).currentEnvironment;
  } catch (error) {
    // No current environment set
  }
  
  for (const [env, file] of Object.entries(envFiles)) {
    try {
      await fs.access(file);
      const isCurrent = env === current;
      const marker = isCurrent ? chalk.green('✓ (active)') : '';
      console.log(`  ${chalk.white(env.padEnd(12))} ${file} ${marker}`);
    } catch (error) {
      console.log(`  ${chalk.gray(env.padEnd(12))} ${file} (not found)`);
    }
  }
  
  console.log('');
}

async function getCurrentEnvironment() {
  try {
    const config = await fs.readFile('.env-current', 'utf8');
    return JSON.parse(config).currentEnvironment;
  } catch (error) {
    return null;
  }
}

module.exports = {
  switchEnvironment,
  listEnvironments,
  getCurrentEnvironment
};
