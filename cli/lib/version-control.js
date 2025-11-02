const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

const VERSIONS_DIR = '.env-versions';

async function ensureVersionsDir() {
  await fs.mkdir(VERSIONS_DIR, { recursive: true });
}

async function saveVersion(message) {
  await ensureVersionsDir();
  
  const timestamp = Date.now();
  const version = {
    id: timestamp,
    message,
    timestamp: new Date().toISOString(),
    files: {}
  };
  
  const envFiles = ['.env', '.env.test', '.env.production'];
  
  for (const file of envFiles) {
    try {
      const content = await fs.readFile(file, 'utf8');
      version.files[file] = content;
    } catch (error) {
      // File doesn't exist
    }
  }
  
  const versionFile = path.join(VERSIONS_DIR, `${timestamp}.json`);
  await fs.writeFile(versionFile, JSON.stringify(version, null, 2));
  
  console.log(chalk.green(`✓ Version saved: ${message}`));
  console.log(chalk.gray(`  ID: ${timestamp}`));
}

async function listVersions() {
  await ensureVersionsDir();
  
  const files = await fs.readdir(VERSIONS_DIR);
  const versions = [];
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const content = await fs.readFile(path.join(VERSIONS_DIR, file), 'utf8');
      versions.push(JSON.parse(content));
    }
  }
  
  versions.sort((a, b) => b.id - a.id);
  
  console.log(chalk.blue('\n📚 Version History:\n'));
  
  for (const version of versions) {
    console.log(chalk.white(`  ${version.id}`));
    console.log(chalk.gray(`  ${version.timestamp}`));
    console.log(chalk.cyan(`  ${version.message}`));
    console.log(chalk.gray(`  Files: ${Object.keys(version.files).join(', ')}`));
    console.log('');
  }
}

async function restoreVersion(versionId) {
  const versionFile = path.join(VERSIONS_DIR, `${versionId}.json`);
  
  try {
    const content = await fs.readFile(versionFile, 'utf8');
    const version = JSON.parse(content);
    
    for (const [file, content] of Object.entries(version.files)) {
      await fs.writeFile(file, content);
      console.log(chalk.green(`✓ Restored ${file}`));
    }
    
    console.log(chalk.green(`\n✓ Version ${versionId} restored`));
  } catch (error) {
    throw new Error(`Version ${versionId} not found`);
  }
}

module.exports = {
  saveVersion,
  listVersions,
  restoreVersion
};
