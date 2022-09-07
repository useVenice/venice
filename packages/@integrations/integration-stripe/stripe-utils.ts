import type {ModeName} from './StripeClient'

export function inferStripeModeFromToken(
  publicOrAccessToken: string,
): ModeName | undefined {
  const regex = /^(pk|sk)_(test|live)_/
  const match = regex.exec(publicOrAccessToken)
  if (match) {
    return match[2] as ModeName
  }

  return undefined
}
