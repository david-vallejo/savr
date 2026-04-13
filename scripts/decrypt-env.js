#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const MASTER_KEY = process.env.MASTER_KEY;
if (!MASTER_KEY) {
  console.error('Error: MASTER_KEY environment variable is required.');
  console.error('Usage: MASTER_KEY=<key> node scripts/decrypt-env.js');
  process.exit(1);
}

const ENC_FILES = [
  path.resolve(__dirname, '..', 'apps', 'web', '.env.enc'),
  path.resolve(__dirname, '..', 'apps', 'mobile', '.env.enc'),
];

function decrypt(json, masterKey) {
  const { salt, iv, tag, data } = JSON.parse(json);

  const key = crypto.pbkdf2Sync(
    masterKey,
    Buffer.from(salt, 'base64'),
    100000,
    32,
    'sha256'
  );

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(iv, 'base64')
  );
  decipher.setAuthTag(Buffer.from(tag, 'base64'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(data, 'base64')),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

let exitCode = 0;

for (const encPath of ENC_FILES) {
  const relative = path.relative(path.resolve(__dirname, '..'), encPath);
  const envPath = encPath.replace(/\.enc$/, '');
  const envRelative = path.relative(path.resolve(__dirname, '..'), envPath);

  if (!fs.existsSync(encPath)) {
    console.warn(`Skipped: ${relative} (file not found)`);
    continue;
  }

  try {
    const json = fs.readFileSync(encPath, 'utf8');
    const plaintext = decrypt(json, MASTER_KEY);
    fs.writeFileSync(envPath, plaintext, 'utf8');
    console.log(`Decrypted: ${relative} → ${envRelative}`);
  } catch (err) {
    console.error(`Failed:   ${relative} — wrong key or corrupted file.`);
    exitCode = 1;
  }
}

process.exit(exitCode);
