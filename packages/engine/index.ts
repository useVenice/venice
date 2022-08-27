import {z} from '@ledger-sync/util'

// Make error message more understandable. But security risk... so turn me off unless debugging
if (process.env['NODE_ENV'] === 'development') {
  z.setErrorMap((_issue, ctx) => {
    // Need to get the `schema` as well.. otherwise very hard
    console.error(`[zod] Data did not pass validation`, ctx.data)
    return {message: ctx.defaultError}
  })
}

// codegen:start {preset: barrel, include: "./{*.{ts,tsx},*/index.{ts,tsx}}", exclude: "./**/*.{d,spec,test,fixture,decorator,stories,web,native,ios,android}.{ts,tsx}"}
export * from './makeMetaStore'
export * from './makeSyncEngine'
export * from './makeSyncHelpers'
export * from './parseWebhookRequest'
export * from './sync'
// codegen:end
