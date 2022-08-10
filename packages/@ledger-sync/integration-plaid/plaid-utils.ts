export function inferPlaidEnvFromToken(
  publicOrAccessToken: string,
): Plaid.EnvName | null {
  const regex = /^(access|public)-(sandbox|development|production)-/
  const match = regex.exec(publicOrAccessToken)

  if (match) {
    return match[2] as Plaid.EnvName
  }

  return null
}
