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

type ExtractKeyOfValueType<T, V> = keyof {
  [k in keyof T as T[k] extends V ? k : never]: T[k]
}

interface Constant<T> {
  value: T
}
const constant = <T>(t: T): Constant<T> => ({value: t})

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
      | ExtractKeyOfValueType<TIn, TOut[k]>
      | Constant<TOut[k]>
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
  id: 'title',
  name: constant('qbooooo'),
  url: (vendor) => `${vendor.qboID}`,
}).mapping

Object.entries(qboVendorMap).forEach(([k, v]) => {
  console.log(
    k,
    ':',
    typeof v === 'function'
      ? prettier.format(v.toString(), {
          arrowParens: 'avoid',
          parser: 'typescript',
          singleQuote: true,
          semi: false,
        })
      : typeof v === 'string'
      ? `.${v}`
      : `${v.value}`,
  )
})
