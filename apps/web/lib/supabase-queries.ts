import {createQueryKeyStore} from '@lukemorales/query-key-factory'
import type {
  RealtimePostgresChangesPayload,
  SupabaseClient,
} from '@supabase/supabase-js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {PROVIDERS} from '@usevenice/app-config/env'
import type {AnySyncProvider, Id, UserId} from '@usevenice/cdk-core'
import {makeId} from '@usevenice/cdk-core'
import {zStandard} from '@usevenice/cdk-core'
import {makeUlid, R} from '@usevenice/util'
import {atom, useAtom} from 'jotai'
import React from 'react'
import {browserSupabase} from '../contexts/common-contexts'
import type {Database} from '../supabase/supabase.gen'
import {browserQueryClient} from './query-client'

import camelcaseKeys from 'camelcase-keys'

// MARK: - Queries

const providerMap = R.mapToObj(PROVIDERS, (p) => [
  p.name as string,
  p as AnySyncProvider,
])

type Institution = Pick<
  Database['public']['Tables']['institution']['Row'],
  'id' | 'external' | 'provider_name' | 'standard'
>
type Resource = Pick<
  Database['public']['Tables']['resource']['Row'],
  'id' | 'display_name' | 'provider_name' | 'settings'
> & {institution: Institution | null}

// TODO: thsi should be done server side...
function parseResource(_reso: Resource | null | undefined) {
  if (!_reso) {
    return _reso
  }
  const reso = camelcaseKeys(_reso)
  const mappers = providerMap[reso.providerName]?.standardMappers
  const standardReso = zStandard.resource
    .omit({id: true})
    .nullish()
    .parse(mappers?.resource?.(reso.settings))
  const standardIns = zStandard.institution
    .omit({id: true})
    .nullish()
    .parse(
      reso.institution && mappers?.institution?.(reso.institution?.external),
    )

  return {
    ...reso,
    ...standardReso,
    id: reso.id as Id['reso'],
    displayName:
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      reso.displayName || standardReso?.displayName || standardIns?.name || '',
    institution: standardIns
      ? {...standardIns, id: reso?.institution?.id as Id['ins']}
      : null,
  }
}

type ConnType = 'source' | 'destination'

function listConnections(supabase: SupabaseClient<Database>) {
  return supabase
    .from('pipeline')
    .select(
      `id,
       last_sync_started_at,
       last_sync_completed_at,
       source_id,
       destination_id,
       source:source_id (id, display_name, provider_name, settings, institution (id, external, standard)),
       destination:destination_id (id, display_name, provider_name, settings, institution (id, external, standard))`,
    )
    .then((res) =>
      (res.data ?? [])
        .map((p) => camelcaseKeys(p))
        .map(({source, destination, sourceId, destinationId, ...pipe}) => {
          const type: ConnType | null =
            !sourceId || sourceId?.startsWith('reso_postgres')
              ? 'destination'
              : !destinationId || destinationId?.startsWith('reso_postgres')
              ? 'source'
              : null
          return {
            ...camelcaseKeys(pipe),
            id: pipe.id as Id['pipe'], // Rename to pipelineId
            syncInProgress:
              (pipe.lastSyncStartedAt && !pipe.lastSyncCompletedAt) ||
              (pipe.lastSyncStartedAt &&
                pipe.lastSyncCompletedAt &&
                pipe.lastSyncStartedAt > pipe.lastSyncCompletedAt),
            type,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            resource: parseResource(
              (type === 'source'
                ? source
                : type === 'destination'
                ? destination
                : null) as Resource | null,
            )!,
          }
        })
        // This shouldn't happen, but just in case...
        .filter((c) => !!c.resource),
    )
}
export type Connection = Awaited<ReturnType<typeof listConnections>>[number]

// TODO: Evaluate putting the whole thing into trpc and run via server supabase
// Would enable better re-use (hello CLI! Also public API) and also eliminiate the need to have separate
// queries / mutations queryKey management. Although it is annoying that we'd essentially be adding
// an extra proxy when we could just hit Supabase directly in the first place...
export const getQueryKeys = (supabase: SupabaseClient<Database>) =>
  createQueryKeyStore({
    connections: {
      list: {
        queryKey: null,
        queryFn: () =>
          listConnections(supabase).then(
            (connections) =>
              R.groupBy(connections, (c) => c.type ?? '') as unknown as Record<
                ConnType,
                Connection[] | undefined
              >,
          ),
      },
    },
  })

export const queries = {
  useConnectionsList: () => {
    useAtom(postgresSubscriptionsAtom)
    return useQuery({
      ...getQueryKeys(browserSupabase).connections.list,
      // Never stale because we explicitly invalidate using supabase realtime
      staleTime: Number.POSITIVE_INFINITY,
    })
  },
}

// MARK: - Mutations

export const mutations = {
  useUpdateResource: () =>
    useMutation(
      async ({
        id,
        ...update
      }: Database['public']['Tables']['resource']['Update'] & {
        id: Id['reso']
      }) => browserSupabase.from('resource').update(update).eq('id', id),
      {
        // TODO: Consider optimistic update
        // Unfortunately we don't have access to the variables at render time
        // If we need a mutationKey per pipeline update we are gonna have to call
        // useUpdateResource within PipelineCard or something similar.
        // @see https://share.cleanshot.com/Px624f99
        mutationKey: ['updateResource'],

        // Consider updating query data directly rather than invalidating
        // This is no longer necessary due to supabase realtime sub
        // However due to network sometimes times changes may actually get missed
        // therefore we still need this for now to be sure
        // We should figure out why react query is not deduplicating the requests though
        // They seem to fire one another
        // onSuccess: () =>
        //   queryClient.invalidateQueries(
        //     getQueryKeys(browserSupabase).pipelines._def,
        //   ),
      },
    ),

  useDeletePipeline: () =>
    useMutation(
      async ({
        pipelineId,
        resourceId,
      }: {
        pipelineId: Id['pipe']
        resourceId: Id['reso']
      }) => {
        await browserSupabase.from('pipeline').delete().eq('id', pipelineId)
        // TODO: Need to properly handle this on the server to
        // 1) Remove orphan resource
        // 2) Revoke before deleting as needed
        if (resourceId.includes('debug')) {
          await browserSupabase.from('resource').delete().eq('id', resourceId)
        }
      },
      // TODO: Revoke & remove the resources as pipelines are deleted
      // We should have a background job for this probably...
    ),

  useCreateDummySource: ({
    ledgerId,
    userId,
  }: {
    ledgerId: Id['reso']
    userId: UserId
  }) =>
    useMutation(async () => {
      const baseId = makeUlid()
      const resourceId = makeId('reso', 'debug', baseId)
      const pipelineId = makeId('pipe', `debug_${baseId}`)

      await browserSupabase.from('resource').insert({
        id: resourceId,
        creator_id: userId,
        display_name: `Dummy ${Date.now()}`,
      })

      await browserSupabase.from('pipeline').insert({
        id: pipelineId,
        source_id: resourceId,
        destination_id: ledgerId,
      })
    }),
}

// MARK: Subscriptions

type PostgresSubscription = ReturnType<typeof subscribePostgresChanges>

export function subscribePostgresChanges(
  tableName: keyof Database['public']['Tables'],
  fn: (change: RealtimePostgresChangesPayload<Record<string, unknown>>) => void,
) {
  const sub = browserSupabase
    // Unique channel name otherwise multiple calls to subscribe would overwrite each other
    .channel(`pg/public.${tableName}.${Date.now()}`)
    .on(
      'postgres_changes',
      {event: '*', schema: 'public', table: tableName},
      (change) => {
        console.log(`[postgres_changes] public.${tableName}`, change)
        fn(change)
      },
    )
    .subscribe()
  console.log(`[postgres_changes] Sub public.${tableName}`)
  return {
    ...sub,
    unsub: () => {
      console.log(`[postgres_changes] Unsub public.${tableName}`)
      void sub.unsubscribe()
    },
  }
}

/** Ties to component lifecycle. Prefer global ones for subscription */
export function usePostgresChanges(
  tableName: keyof Database['public']['Tables'],
  fn: (change: RealtimePostgresChangesPayload<Record<string, unknown>>) => void,
) {
  React.useEffect(() => subscribePostgresChanges(tableName, fn).unsub)
}

export const postgresSubscriptionsAtom = atom<PostgresSubscription[]>([])
postgresSubscriptionsAtom.onMount = (setAtom) => {
  const invalidate = () =>
    browserQueryClient.invalidateQueries(
      getQueryKeys(browserSupabase).connections._def,
    )

  // Consider updating query data directly rather than invalidating for things like sync status updates
  const subs = [
    subscribePostgresChanges('resource', invalidate),
    // it seems that if we have two subscriptions then we don't get any changes at all
    // but if we have one subscription we do... why is that possibly the case?
    subscribePostgresChanges('pipeline', invalidate),

    // Institutions do not change very often so no need to monitor closely
  ]
  setAtom(subs)
  return () => subs.forEach((s) => s.unsub())
}
