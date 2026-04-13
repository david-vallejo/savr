#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const MASTER_KEY = process.env.MASTER_KEY;
if (!MASTER_KEY) {
  console.error('Error: MASTER_KEY environment variable is required.');
  console.error('Usage: MASTER_KEY=<key> node scripts/encrypt-env.js');
  process.exit(1);
}

const ENV_FILES = [
  path.resolve(__dirname, '..', 'apps', 'web', '.env'),
  path.resolve(__dirname, '..', 'apps', 'mobile', '.env'),
];

function encrypt(plaintext, masterKey) {
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(masterKey, salt, 100000, 32, 'sha256');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return JSON.stringify({
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    data: encrypted.toString('base64'),
  });
}

let exitCode = 0;

for (const envPath of ENV_FILES) {
  const relative = path.relative(path.resolve(__dirname, '..'), envPath);

  if (!fs.existsSync(envPath)) {
    console.warn(`Skipped: ${relative} (file not found)`);
    continue;
  }

  const plaintext = fs.readFileSync(envPath, 'utf8');
  const encrypted = encrypt(plaintext, MASTER_KEY);
  const encPath = envPath + '.enc';

  fs.writeFileSync(encPath, encrypted, 'utf8');
  console.log(`Encrypted: ${relative} → ${relative}.enc`);
}

process.exit(exitCode);
