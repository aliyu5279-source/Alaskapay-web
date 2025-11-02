const axios = require('axios');
const fs = require('fs').promises;
const dotenv = require('dotenv');
const chalk = require('chalk');

const VERCEL_API = 'https://api.vercel.com';

async function getVercelConfig() {
  const configPath = '.env-sync-config.json';
  const config = await fs.readFile(configPath, 'utf8');
  return JSON.parse(config);
}

async function syncToVercel(environment) {
  const config = await getVercelConfig();
  const envFile = environment === 'test' ? '.env.test' : '.env.production';
  
  const envContent = await fs.readFile(envFile, 'utf8');
  const vars = dotenv.parse(envContent);
  
  const token = process.env.VERCEL_TOKEN || config.vercel?.token;
  const projectId = config.vercel?.projectId;
  
  if (!token || !projectId) {
    throw new Error('Vercel credentials missing');
  }
  
  const target = environment === 'test' ? 'preview' : 'production';
  
  for (const [key, value] of Object.entries(vars)) {
    try {
      await axios.post(
        `${VERCEL_API}/v10/projects/${projectId}/env`,
        {
          key,
          value,
          type: 'encrypted',
          target: [target]
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log(chalk.gray(`  ✓ ${key}`));
    } catch (error) {
      if (error.response?.status === 409) {
        // Variable exists, update it
        await updateVercelVar(projectId, key, value, target, token);
      } else {
        console.log(chalk.yellow(`  ⚠ ${key}: ${error.message}`));
      }
    }
  }
}

async function updateVercelVar(projectId, key, value, target, token) {
  const vars = await axios.get(
    `${VERCEL_API}/v9/projects/${projectId}/env`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
  const existing = vars.data.envs.find(v => v.key === key);
  if (existing) {
    await axios.patch(
      `${VERCEL_API}/v9/projects/${projectId}/env/${existing.id}`,
      { value, target: [target] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
}

async function syncFromVercel(environment) {
  const config = await getVercelConfig();
  const token = process.env.VERCEL_TOKEN || config.vercel?.token;
  const projectId = config.vercel?.projectId;
  
  const response = await axios.get(
    `${VERCEL_API}/v9/projects/${projectId}/env`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
  const envFile = environment === 'test' ? '.env.test' : '.env.production';
  let content = '';
  
  for (const env of response.data.envs) {
    content += `${env.key}=${env.value}\n`;
  }
  
  await fs.writeFile(envFile, content);
  console.log(chalk.green(`✓ Pulled ${response.data.envs.length} variables`));
}

module.exports = {
  syncToVercel,
  syncFromVercel
};
