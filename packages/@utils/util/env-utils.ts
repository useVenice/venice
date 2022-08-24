export function getEnvVars(): Record<string, string | undefined> {
  return (
    (typeof window !== 'undefined' && window.localStorage) ||
    (typeof process !== 'undefined' && process.env) ||
    {}
  )
}

export function getEnvVar(key: string): string | undefined {
  return getEnvVars()[key] ?? undefined
}
