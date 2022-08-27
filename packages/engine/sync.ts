import {
  AnyEntityPayload,
  Destination,
  Link,
  Source,
} from '@ledger-sync/cdk-core'
import {identity, Rx, toCompletion} from '@ledger-sync/util'

type Data = AnyEntityPayload

export async function sync<T extends Data = Data>(input: {
  source: Source<T>
  links: Array<Link<T, T>> | undefined
  destination: Destination<T>
  watch: boolean | undefined
}) {
  const start = Date.now()
  let count = 0
  let ready = false
  await toCompletion(
    // Raw Source, may come from fs, firestore or postgres
    input.source
      // Plugins
      .pipe(...((input.links ?? []) as [Link<T>, Link<T>]))
      // Destination
      .pipe(input.destination)
      // Progress & flow controlß
      .pipe(!input.watch ? Rx.takeWhile((e) => e.type !== 'ready') : identity),
    (e) => {
      count++
      if (ready) {
        console.warn(`#${count}: Event received after ready`, e)
      }
      if (!e) {
        console.log(`#${count}: Bad event`, e)
      } else if (e.type === 'ready') {
        console.log(`#${count}: Ready in ${Date.now() - start}ms`)
        ready = true
      } else if (e.type === 'data') {
        console.log(`#${count}: ${e.data.id} exists=${e.data.entity != null}`)
      } else {
        console.log(`#${count}: Received ${e.type} ${Date.now() - start}ms`)
      }
    },
  )
  console.log(`Sync complete, should exit unless we have open handles`)
}
