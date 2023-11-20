/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserResponsePreferences = {
  properties: {
    dateFormat: {
      type: 'string',
      description: `The dateformat of the user.This attribute is just a place holder and has no impact on any other API services.`,
      maxLength: 2147483647,
      minLength: 1,
    },
    timeZone: {
      type: 'string',
      description: `The timezone of the user. This attribute is just a place holder and has no impact on any other API services.`,
      maxLength: 2147483647,
      minLength: 1,
    },
    currency: {
      type: 'Enum',
    },
    locale: {
      type: 'Enum',
    },
  },
} as const
