import prettier from 'prettier'

import {z} from '@usevenice/util'

const Vendor = z.object({
  name: z.string(),
  url: z.string(),
  id: z.string(),
})

const QBOVendor = z.object({
  title: z.string(),
  qboID: z.number(),
})

type ExtractKeyOfValueType<T, V> = Extract<
  keyof {
    [k in keyof T as T[k] extends V ? k : never]: T[k]
  },
  string
>

interface Getter<T extends string> {
  keypath: T
}
const get = <T extends string>(keypath: T): Getter<T> => ({keypath})

export function mapper<
  ZInputSchema extends z.ZodTypeAny,
  ZOutputSchema extends z.ZodTypeAny,
  TOut extends z.infer<ZOutputSchema> = z.infer<ZOutputSchema>,
  TIn extends z.infer<ZInputSchema> = z.infer<ZInputSchema>,
>(
  zExt: ZInputSchema,
  zCom: ZOutputSchema,
  mapping: {
    [k in keyof TOut]:
      | TOut[k] // Constant
      | Getter<ExtractKeyOfValueType<TIn, TOut[k]>>
      | ((ext: TIn) => TOut[k])
  },
) {
  return {
    inputSchema: zCom,
    outputSchema: zExt,
    mapping,
  }
}

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
