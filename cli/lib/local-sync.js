const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');
const chalk = require('chalk');

async function syncToLocal(environment) {
  const sourceFile = environment === 'test' ? '.env.test' : '.env.production';
  const targetFile = '.env';
  
  try {
    const content = await fs.readFile(sourceFile, 'utf8');
    await fs.writeFile(targetFile, content);
    
    const vars = dotenv.parse(content);
    console.log(chalk.green(`✓ Synced ${Object.keys(vars).length} variables to .env`));
  } catch (error) {
    throw new Error(`Failed to sync to local: ${error.message}`);
  }
}

async function loadLocal(environment) {
  const envFile = environment === 'test' ? '.env.test' : '.env.production';
  
  try {
    const content = await fs.readFile(envFile, 'utf8');
    return dotenv.parse(content);
  } catch (error) {
    throw new Error(`Failed to load ${envFile}: ${error.message}`);
  }
}

async function backupLocal() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), '.env-backups');
  
  await fs.mkdir(backupDir, { recursive: true });
  
  const files = ['.env', '.env.test', '.env.production'];
  
  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf8');
      const backupFile = path.join(backupDir, `${file}.${timestamp}`);
      await fs.writeFile(backupFile, content);
      console.log(chalk.gray(`  ✓ Backed up ${file}`));
    } catch (error) {
      // File doesn't exist, skip
    }
  }
}

module.exports = {
  syncToLocal,
  loadLocal,
  backupLocal
};
