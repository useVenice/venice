import type {RouterOutput} from '@usevenice/engine-backend'

// TODO: remove this whole file completely as supabase is an optional dependency
// and this includes not depending on Supabase real time to invalidate connection list changes.

export type Connection = RouterOutput['listConnections'][number]
