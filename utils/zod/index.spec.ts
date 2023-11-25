import {z, zodToOas31Schema} from './index'

/* eslint-disable unicorn/template-indent */ /* eslint-disable jest-formatting/padding-around-test-blocks */

test('simple value', () => {
  expect(zodToOas31Schema(z.literal('myvalue'))).toMatchInlineSnapshot(
    `
    {
      "enum": [
        "myvalue",
      ],
      "type": "string",
    }
  `,
  )
})
test('enums', () => {
  /* that's technically an error as zod does not alow enums with number types... */ expect(
    zodToOas31Schema(z.enum([123, 223] as unknown as [string])),
  ).toMatchInlineSnapshot(
    `
                                                                                      {
                                                                                        "enum": [
                                                                                          123,
                                                                                          223,
                                                                                        ],
                                                                                        "type": "string",
                                                                                      }
                                                                                    `,
  )
  expect(
    zodToOas31Schema(z.enum([] as unknown as [string])),
  ).toMatchInlineSnapshot(
    `
    {
      "enum": [],
      "type": "string",
    }
  `,
  )
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
  ).toMatchInlineSnapshot(
    `
    {
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
  `,
  )
})
test('streams', () => {
  expect(zodToOas31Schema(z.record(z.object({})))).toMatchInlineSnapshot(
    `
    {
      "additionalProperties": {
        "properties": {},
        "type": "object",
      },
      "type": "object",
    }
  `,
  )
  expect(
    zodToOas31Schema(
      z.object({
        streams: z.record(
          z.enum(['transaction', 'account']),
          z.object({enabled: z.boolean().nullish()}),
        ),
      }),
    ),
  ).toMatchInlineSnapshot(
    `
    {
      "properties": {
        "streams": {
          "additionalProperties": false,
          "properties": {
            "account": {
              "properties": {
                "enabled": {
                  "type": [
                    "boolean",
                    "null",
                  ],
                },
              },
              "type": "object",
            },
            "transaction": {
              "properties": {
                "enabled": {
                  "type": [
                    "boolean",
                    "null",
                  ],
                },
              },
              "type": "object",
            },
          },
          "type": "object",
        },
      },
      "required": [
        "streams",
      ],
      "type": "object",
    }
  `,
  )
  expect(
    zodToOas31Schema(
      z.array(z.object({name: z.enum(['transaction', 'account'])})),
    ),
  ).toMatchInlineSnapshot(
    `
    {
      "items": {
        "properties": {
          "name": {
            "enum": [
              "transaction",
              "account",
            ],
            "type": "string",
          },
        },
        "required": [
          "name",
        ],
        "type": "object",
      },
      "type": "array",
    }
  `,
  )
  expect(
    zodToOas31Schema(z.array(z.enum(['transaction', 'account']))),
  ).toMatchInlineSnapshot(
    `
    {
      "items": {
        "enum": [
          "transaction",
          "account",
        ],
        "type": "string",
      },
      "type": "array",
    }
  `,
  )
})
