/* eslint-disable unicorn/template-indent */ /* eslint-disable jest-formatting/padding-around-test-blocks */
import {z, zodToOas31Schema} from './index'

test('simple value', () => {
  expect(zodToOas31Schema(z.literal('myvalue'))).toMatchInlineSnapshot(
    `
    {
      "$schema": "https://spec.openapis.org/oas/3.1/dialect/base",
      "enum": [
        "myvalue",
      ],
      "type": "string",
    }
  `,
  )
})
test('enums', () => {
  // Well that's technically an error as zod does not alow enums with number types...
  expect(zodToOas31Schema(z.enum([123, 223] as unknown as [string])))
    .toMatchInlineSnapshot(`
    {
      "$schema": "https://spec.openapis.org/oas/3.1/dialect/base",
      "enum": [
        123,
        223,
      ],
      "type": "string",
    }
  `)
  expect(zodToOas31Schema(z.enum([] as unknown as [string])))
    .toMatchInlineSnapshot(`
    {
      "$schema": "https://spec.openapis.org/oas/3.1/dialect/base",
      "enum": [],
      "type": "string",
    }
  `)
})
test('union with description', () => {
  expect(
    zodToOas31Schema(
      z.union([
        z.literal('123').describe('hello'),
        z.literal('456').describe('world'),
      ]),
    ),
  ).toMatchInlineSnapshot(
    `
    {
      "$schema": "https://spec.openapis.org/oas/3.1/dialect/base",
      "anyOf": [
        {
          "description": "hello",
          "enum": [
            "123",
          ],
          "type": "string",
        },
        {
          "description": "world",
          "enum": [
            "456",
          ],
          "type": "string",
        },
      ],
    }
  `,
  )
})
test('enum description to title', () => {
  expect(
    zodToOas31Schema(
      z.discriminatedUnion('type', [
        z.object({
          type: z.literal('oauth'),
          clientId: z.string(),
          clientSecret: z.string(),
        }),
        z.object({type: z.literal('apikey')}),
      ]),
    ),
  ).toMatchInlineSnapshot(
    `
    {
      "$schema": "https://spec.openapis.org/oas/3.1/dialect/base",
      "oneOf": [
        {
          "properties": {
            "clientId": {
              "type": "string",
            },
            "clientSecret": {
              "type": "string",
            },
            "type": {
              "enum": [
                "oauth",
              ],
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
          "properties": {
            "type": {
              "enum": [
                "apikey",
              ],
              "type": "string",
            },
          },
          "required": [
            "type",
          ],
          "type": "object",
        },
      ],
    }
  `,
  )
})
test('enum description to title 2', () => {
  expect(
    zodToOas31Schema(
      z.object({
        oauth: z
          .union([
            z
              .object({clientId: z.string(), clientSecret: z.string()})
              .describe('Enable'),
            z.null().describe('Disable'),
          ])
          .openapi({title: 'Oauth settings'}),
        apikey: z.boolean().optional(),
      }),
    ),
  ).toMatchInlineSnapshot(
    `
    {
      "$schema": "https://spec.openapis.org/oas/3.1/dialect/base",
      "properties": {
        "apikey": {
          "type": "boolean",
        },
        "oauth": {
          "anyOf": [
            {
              "description": "Enable",
              "properties": {
                "clientId": {
                  "type": "string",
                },
                "clientSecret": {
                  "type": "string",
                },
              },
              "required": [
                "clientId",
                "clientSecret",
              ],
              "type": "object",
            },
            {
              "description": "Disable",
              "type": "null",
            },
          ],
          "title": "Oauth settings",
        },
      },
      "required": [
        "oauth",
      ],
      "type": "object",
    }
  `,
  )
})
test('refs value', () => {
  const config = z.object({client_id: z.string()})
  const connConfig = z.object({display_name: z.string(), config})
  expect(zodToOas31Schema(connConfig, {config})).toMatchInlineSnapshot(
    `
    {
      "$schema": "https://spec.openapis.org/oas/3.1/dialect/base",
      "components": {
        "schemas": {
          "config": {
            "properties": {
              "client_id": {
                "type": "string",
              },
            },
            "required": [
              "client_id",
            ],
            "type": "object",
          },
        },
      },
      "properties": {
        "config": {
          "$ref": "#/components/schemas/config",
        },
        "display_name": {
          "type": "string",
        },
      },
      "required": [
        "display_name",
        "config",
      ],
      "type": "object",
    }
  `,
  )
})
test('Nullable values', () => {
  const resoId = z
    .string()
    .brand('reso')
    .openapi({description: 'Must start with reso_'})
  expect(
    zodToOas31Schema(
      z.object({
        str: z.string().nullish(),
        id: z.string().brand('reso').nullish(),
        resoId: resoId.nullish(),
      }),
      {resoId},
    ),
  ).toMatchInlineSnapshot(`
    {
      "$schema": "https://spec.openapis.org/oas/3.1/dialect/base",
      "components": {
        "schemas": {
          "resoId": {
            "description": "Must start with reso_",
            "type": "string",
          },
        },
      },
      "properties": {
        "id": {
          "type": [
            "string",
            "null",
          ],
        },
        "resoId": {
          "oneOf": [
            {
              "$ref": "#/components/schemas/resoId",
            },
            {
              "type": "null",
            },
          ],
        },
        "str": {
          "type": [
            "string",
            "null",
          ],
        },
      },
      "type": "object",
    }
  `)
})
