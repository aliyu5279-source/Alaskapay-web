const axios = require('axios');
const fs = require('fs').promises;
const dotenv = require('dotenv');
const chalk = require('chalk');

const NETLIFY_API = 'https://api.netlify.com/api/v1';

async function getNetlifyConfig() {
  const configPath = '.env-sync-config.json';
  try {
    const config = await fs.readFile(configPath, 'utf8');
    return JSON.parse(config);
  } catch (error) {
    throw new Error('Config not found. Run: env-sync init');
  }
}

async function syncToNetlify(environment) {
  const config = await getNetlifyConfig();
  const envFile = environment === 'test' ? '.env.test' : '.env.production';
  
  const envContent = await fs.readFile(envFile, 'utf8');
  const vars = dotenv.parse(envContent);
  
  const token = process.env.NETLIFY_AUTH_TOKEN || config.netlify?.token;
  const siteId = config.netlify?.siteId;
  
  if (!token || !siteId) {
    throw new Error('Netlify credentials missing');
  }
  
  for (const [key, value] of Object.entries(vars)) {
    try {
      await axios.patch(
        `${NETLIFY_API}/sites/${siteId}/env/${key}`,
        {
          context: environment === 'test' ? 'branch-deploy' : 'production',
          value
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log(chalk.gray(`  ✓ ${key}`));
    } catch (error) {
      console.log(chalk.yellow(`  ⚠ ${key}: ${error.message}`));
    }
  }
}

async function syncFromNetlify(environment) {
  const config = await getNetlifyConfig();
  const token = process.env.NETLIFY_AUTH_TOKEN || config.netlify?.token;
  const siteId = config.netlify?.siteId;
  
  const response = await axios.get(
    `${NETLIFY_API}/sites/${siteId}/env`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  
  const envFile = environment === 'test' ? '.env.test' : '.env.production';
  let content = '';
  
  for (const [key, data] of Object.entries(response.data)) {
    const value = data.values?.[0]?.value || '';
    content += `${key}=${value}\n`;
  }
  
  await fs.writeFile(envFile, content);
  console.log(chalk.green(`✓ Pulled ${Object.keys(response.data).length} variables`));
}

module.exports = {
  syncToNetlify,
  syncFromNetlify
};
