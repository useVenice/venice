import {z} from 'zod'

import {zodToJsonSchema} from './zod-jsonschema-utils'

test('simple value', () => {
  expect(zodToJsonSchema(z.literal('myvalue'))).toMatchInlineSnapshot(`
    {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "const": "myvalue",
      "type": "string",
    }
  `)
})

test('union with description', () => {
  expect(
    zodToJsonSchema(
      z.union([
        z.literal('123').describe('hello'),
        z.literal('456').describe('world'),
      ]),
    ),
  ).toMatchInlineSnapshot(`
    {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "anyOf": [
        {
          "const": "123",
          "title": "hello",
          "type": "string",
        },
        {
          "const": "456",
          "title": "world",
          "type": "string",
        },
      ],
      "type": "string",
    }
  `)
})

test('enum description to title', () => {
  expect(
    zodToJsonSchema(
      z.discriminatedUnion('type', [
        z.object({
          type: z.literal('oauth'),
          clientId: z.string(),
          clientSecret: z.string(),
        }),
        z.object({type: z.literal('apikey')}),
      ]),
    ),
  ).toMatchInlineSnapshot(`
    {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "anyOf": [
        {
          "additionalProperties": false,
          "properties": {
            "clientId": {
              "type": "string",
            },
            "clientSecret": {
              "type": "string",
            },
            "type": {
              "const": "oauth",
              "type": "string",
            },
          },
          "required": [
            "type",
            "clientId",
            "clientSecret",
          ],
          "type": "object",
        },
        {
          "additionalProperties": false,
          "properties": {
            "type": {
              "const": "apikey",
              "type": "string",
            },
          },
          "required": [
            "type",
          ],
          "type": "object",
        },
      ],
      "type": "object",
    }
  `)
})

test('enum description to title 2', () => {
  expect(
    zodToJsonSchema(
      z.object({
        oauth: z.union([
          z
            .object({
              clientId: z.string(),
              clientSecret: z.string(),
            })
            .describe('Enable'),
          z.null().describe('Disable'),
        ]),

        apikey: z.boolean().optional(),
      }),
    ),
  ).toMatchInlineSnapshot(`
    {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "additionalProperties": false,
      "properties": {
        "apikey": {
          "title": "apikey",
          "type": "boolean",
        },
        "oauth": {
          "anyOf": [
            {
              "additionalProperties": false,
              "properties": {
                "clientId": {
                  "title": "oauth.clientId",
                  "type": "string",
                },
                "clientSecret": {
                  "title": "oauth.clientSecret",
                  "type": "string",
                },
              },
              "required": [
                "clientId",
                "clientSecret",
              ],
              "title": "oauth: Enable",
              "type": "object",
            },
            {
              "title": "oauth: Disable",
              "type": "null",
            },
          ],
          "title": "oauth",
        },
      },
      "required": [
        "oauth",
      ],
      "type": "object",
    }
  `)
})
