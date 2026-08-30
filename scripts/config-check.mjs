#!/usr/bin/env node
import { loadEnvFiles, envFileNames } from './lib/env-file.mjs';
import { readFileSync } from 'node:fs';

const HERE = import.meta.url;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

function parseDeclarations() {
  const found = new Map();

  for (const file of ['public.ts', 'server.ts']) {
    const source = readFileSync(new URL(`../src/lib/config/${file}`, HERE), 'utf8');
    const pattern =
      /declare\(\s*'([A-Z][A-Z0-9_]*)'\s*,[\s\S]*?'(required|defaulted|feature)'\s*,?\s*\)/g;

    for (const [, name, requirement] of source.matchAll(pattern)) {
      found.set(name, { requirement, file });
    }
  }

  return found;
}

const declarations = parseDeclarations();

if (declarations.size === 0) {
  console.error(red('✗ Parsed no declarations from src/lib/config/.'));
  process.exit(1);
}

const { env, loadedAny } = loadEnvFiles(HERE);

if (!loadedAny) {
  console.error(red('✗ No .env or .env.local found.'));
  console.error('  Copy .env.local.example and fill it in.');
  process.exit(1);
}

const missing = [];
const defaulted = [];
const disabled = [];

for (const [name, { requirement }] of declarations) {
  const present = Boolean(env[name] && env[name].length > 0);
  if (present) continue;
  if (requirement === 'required') missing.push(name);
  else if (requirement === 'defaulted') defaulted.push(name);
  else disabled.push(name);
}

const exampleNames = new Set(envFileNames(HERE, '.env.local.example'));
const declaredNames = new Set([...declarations.keys()]);
const undocumented = [...declaredNames].filter((n) => !exampleNames.has(n));
const orphaned = [...exampleNames].filter((n) => !declaredNames.has(n));

console.log(`\nChecked ${declarations.size} declared variables against .env / .env.local\n`);

if (missing.length) {
  console.log(red('REQUIRED, NOT SET'));
  for (const name of missing) {
    console.log(`  ${red('✗')} ${name}  ${dim(`(${declarations.get(name).file})`)}`);
  }
  console.log('');
}

if (defaulted.length) {
  console.log(yellow('RUNNING ON A DEFAULT'));
  for (const name of defaulted) console.log(`  ${yellow('!')} ${name}`);
  console.log('');
}

if (disabled.length) {
  console.log(dim('FEATURES OFF (absent by choice is fine)'));
  for (const name of disabled) console.log(dim(`  · ${name}`));
  console.log('');
}

if (undocumented.length || orphaned.length) {
  console.log(red('DRIFT — .env.local.example does not match the code'));
  for (const name of undocumented) {
    console.log(`  ${red('✗')} ${name} is declared in src/lib/config/ but missing from the example`);
  }
  for (const name of orphaned) {
    console.log(`  ${red('✗')} ${name} is in the example but declared nowhere in src/lib/config/`);
  }
  console.log('');
}

const failed = missing.length > 0 || undocumented.length > 0 || orphaned.length > 0;

if (failed) {
  console.log(red('✗ Configuration check failed.\n'));
  process.exit(1);
}

console.log(green('✓ All required configuration is present.\n'));
