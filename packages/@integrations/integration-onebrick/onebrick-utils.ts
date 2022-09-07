import type {EnvName} from './OneBrickClient'

export function inferOneBrickEnvFromToken(
  publicOrAccessToken: string,
): EnvName | null {
  const regex = /^(access|public)-(sandbox|development|production)-/
  const match = regex.exec(publicOrAccessToken)

  if (match) {
    return match[2] as EnvName
  }

  return null
}
