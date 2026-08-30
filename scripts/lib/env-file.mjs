import { readFileSync } from 'node:fs';

export function loadEnvFiles(baseUrl, files = ['.env', '.env.local'], prefix = '../') {
  const env = {};
  let loadedAny = false;

  for (const file of files) {
    let contents;
    try {
      contents = readFileSync(new URL(`${prefix}${file}`, baseUrl), 'utf8');
    } catch {
      continue;
    }

    loadedAny = true;

    for (const line of contents.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
      const i = trimmed.indexOf('=');
      env[trimmed.slice(0, i).trim()] = trimmed
        .slice(i + 1)
        .trim()
        .replace(/^["']|["']$/g, '');
    }
  }

  return { env, loadedAny };
}

export function envFileNames(baseUrl, file, prefix = '../') {
  const contents = readFileSync(new URL(`${prefix}${file}`, baseUrl), 'utf8');

  return contents
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => line.slice(0, line.indexOf('=')).trim())
    .filter((name) => /^[A-Z][A-Z0-9_]*$/.test(name));
}
