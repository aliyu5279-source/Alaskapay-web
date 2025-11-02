const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

async function getEncryptionKey() {
  const keyPath = path.join(process.cwd(), '.env-sync-key');
  
  try {
    const key = await fs.readFile(keyPath, 'utf8');
    return Buffer.from(key, 'hex');
  } catch (error) {
    // Generate new key
    const key = crypto.randomBytes(KEY_LENGTH);
    await fs.writeFile(keyPath, key.toString('hex'));
    console.log('🔑 Generated new encryption key: .env-sync-key');
    console.log('⚠️  Keep this file secure and do NOT commit to git!');
    return key;
  }
}

async function encryptVars(inputFile) {
  const content = await fs.readFile(inputFile, 'utf8');
  const key = await getEncryptionKey();
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(content, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  const result = {
    encrypted,
    iv: iv.toString('hex'),
    salt: salt.toString('hex'),
    tag: tag.toString('hex'),
    timestamp: new Date().toISOString()
  };
  
  const outputFile = `${inputFile}.encrypted`;
  await fs.writeFile(outputFile, JSON.stringify(result, null, 2));
  
  console.log(`✓ Encrypted ${inputFile} → ${outputFile}`);
}

async function decryptVars(inputFile) {
  const content = await fs.readFile(inputFile, 'utf8');
  const data = JSON.parse(content);
  const key = await getEncryptionKey();
  
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(data.iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(data.tag, 'hex'));
  
  let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  const outputFile = inputFile.replace('.encrypted', '');
  await fs.writeFile(outputFile, decrypted);
  
  console.log(`✓ Decrypted ${inputFile} → ${outputFile}`);
}

module.exports = {
  encryptVars,
  decryptVars,
  getEncryptionKey
};
