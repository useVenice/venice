import * as LibPhoneNumber from 'libphonenumber-js'

export function isValidPhoneNumber(text: string) {
  const phoneNumber = LibPhoneNumber.parsePhoneNumberFromString(text, 'US')
  return phoneNumber ? phoneNumber.isValid() : false
}

export function parsePhoneNumber(
  text: string | null | undefined,
  countryCode?: string | null,
) {
  if (!text) {
    return null
  }

  try {
    const phoneNumber = LibPhoneNumber.parsePhoneNumberFromString(
      text,
      (countryCode as LibPhoneNumber.CountryCode) ?? 'US',
    )
    if (!phoneNumber || !phoneNumber.isValid()) {
      return null
    }
    return phoneNumber
  } catch {
    return null
  }
}

export function normalizePhoneNumber(
  text: string | null | undefined,
  countryCode?: string | null,
) {
  const phoneNumber = parsePhoneNumber(text, countryCode)
  if (!phoneNumber) {
    return null
  }
  return phoneNumber.format('E.164')
}

export function parseAndFormatPhoneNumber(
  text: string | null | undefined,
  countryCode?: string | null,
) {
  const phoneNumber = parsePhoneNumber(text, countryCode)
  if (!phoneNumber) {
    return null
  }
  return {
    e164: phoneNumber.format('E.164'),
    display: phoneNumber.format('INTERNATIONAL'),
  }
}

export function formatPhoneNumber(text: string | null | undefined) {
  const res = parseAndFormatPhoneNumber(text)
  return res?.display ?? new LibPhoneNumber.AsYouType().input(text ?? '')
}
