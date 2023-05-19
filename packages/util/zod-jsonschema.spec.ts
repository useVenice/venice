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

test('simple value with description', () =>
  expect(zodToJsonSchema(z.literal('myvalue').describe('hello')))
    .toMatchInlineSnapshot(`
    {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "const": "myvalue",
      "title": "hello",
      "type": "string",
    }
  `))

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
