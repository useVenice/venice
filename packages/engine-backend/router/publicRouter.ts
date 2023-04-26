import {publicProcedure, trpc} from './_base'

export const publicRouter = trpc.router({
  health: publicProcedure.query(() => 'Ok ' + new Date().toISOString()),
})
