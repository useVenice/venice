import prettier from 'prettier'

import {z} from '@usevenice/zod'

import {get, mapper} from './new-mapper'

const Vendor = z.object({
  name: z.string(),
  url: z.string(),
  id: z.string(),
})

const QBOVendor = z.object({
  title: z.string(),
  qboID: z.number(),
})
const qboVendorMap = mapper(QBOVendor, Vendor, {
  id: get('title'),
  name: 'qboooo',
  url: (vendor) => `${vendor.qboID}`,
}).mapping

const mapper2 = (vendor: z.infer<typeof QBOVendor>) => ({
  id: vendor.title,
  name: 'qbooooo',
  url: `${vendor.qboID}`,
})

function prettify(code: string) {
  return prettier.format(code, {
    arrowParens: 'avoid',
    parser: 'typescript',
    singleQuote: true,
    semi: false,
    printWidth: 30,
  })
}

test('doc gen', () => {
  Object.entries(qboVendorMap).forEach(([k, v]) => {
    console.log(
      k,
      ':',
      typeof v === 'function'
        ? prettify(v.toString())
        : typeof v === 'object' && 'keypath' in v
        ? `.${v.keypath}`
        : JSON.stringify(v),
    )
  })
  console.log(prettify(mapper2.toString()))
  expect(true).toBeTruthy()
})
