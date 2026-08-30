export type Requirement = 'required' | 'defaulted' | 'feature';

export interface Declaration {
  name: string;
  requirement: Requirement;
  present: boolean;
}

const declarations: Declaration[] = [];

export function declare(
  name: string,
  value: string | undefined,
  requirement: Requirement,
): string | undefined {
  if (!declarations.some((entry) => entry.name === name)) {
    declarations.push({
      name,
      requirement,
      present: Boolean(value && value.length > 0),
    });
  }

  return value && value.length > 0 ? value : undefined;
}

export function str(value: string | undefined, fallback: string): string {
  return value && value.length > 0 ? value : fallback;
}

export function oneOf<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  const normalised = value?.trim().toLowerCase();
  return allowed.includes(normalised as T) ? (normalised as T) : fallback;
}

export function url(value: string | undefined, fallback: string): string {
  return str(value, fallback).replace(/\/+$/, '');
}

export interface ConfigReport {
  missing: string[];
  defaulted: string[];
  disabled: string[];
}

export function configReport(): ConfigReport {
  return {
    missing: declarations
      .filter((d) => d.requirement === 'required' && !d.present)
      .map((d) => d.name),
    defaulted: declarations
      .filter((d) => d.requirement === 'defaulted' && !d.present)
      .map((d) => d.name),
    disabled: declarations
      .filter((d) => d.requirement === 'feature' && !d.present)
      .map((d) => d.name),
  };
}
