### Link Types

|                   |                            |
| ----------------- | -------------------------- |
| Type              | Equals                     |
| `SyncSource`      | `Observable<Op>`           |
| `SyncLink`        | `OperatorFunction<Op, Op>` |
| `SyncDestination` | `OperatorFunction<Op, Op>` |

### Meta types

|                                 |                                        |       |                     |
| ------------------------------- | -------------------------------------- | ----- | ------------------- |
| Type                            | Raw                                    | Input | Cooked              |
| `Provider`                      | `enum`                                 |       | `AnySyncProvider`   |
| `Integration`                   | `{id, config}`                         |       | `ParsedIntegration` |
| `Connection`                    | `{id, intId, secrets, info, standard}` |       | `ParsedIntegration` |
| `Pipeline.{Source,Destination}` | `{connId, settings, cache}`            |       |                     |
| `Pipeline`                      | `{id, src, dest}`                      |       |                     |

https://coda.io/d/Ledger-Sync_d_8l5iwiBu8/Providers-Status_sunT8#Provider-By-status_tuA2n/r11

Make some changes inside the subtree
