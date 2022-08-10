// import {
//   A,
//   compact,
//   Deferred,
//   identity,
//   Merge,
//   objectFromArray,
//   Rx,
//   rxjs,
//   z,
//   zCast,
// } from '@ledger-sync/util'
// import {
//   // firebaseProvider,
//   SerializedTimestamp,
// } from '@ledger-sync/core-integration-firebase'
// import {makeSyncProvider, SyncOperation} from '@ledger-sync/core-sync'
// import {
//   makeLedgerSyncProvider,
//   makePostingsMap,
// } from '@ledger-sync/ledger-sync'
// import {_parseAccounts, _parseConnectionInfo} from './foreceipt-utils'
// import {makeForeceiptClient, zForeceiptConfig} from './ForeceiptClientNext'

// type ForeceiptEntity = z.infer<typeof base['sourceOutputEntity']>
// type ForeceiptSyncOperation = SyncOperation<ForeceiptEntity>


export const TODO = ''
// // TODO: Change it with the
// const base = makeLedgerSyncProvider({
//   ...makeLedgerSyncProvider.base({
//     connectionSettings: zForeceiptConfig,
//     sourceOutputEntity: z.discriminatedUnion('entityName', [
//       z.object({
//         id: z.string(),
//         entityName: z.literal('account'),
//         entity: zCast<Foreceipt.Account>(),
//         info: zCast<ReturnType<typeof _parseConnectionInfo> | undefined>(),
//       }),
//       z.object({
//         id: z.string(),
//         entityName: z.literal('transaction'),
//         entity: zCast<
//           Merge<
//             Foreceipt.Receipt,
//             {
//               create_time: SerializedTimestamp
//               last_update_time: SerializedTimestamp
//             }
//           >
//         >(),
//         info: zCast<
//           | ({_id?: Id.external} & ReturnType<typeof _parseConnectionInfo>)
//           | undefined
//         >(),
//       }),
//     ]),

//     sourceMapEntity: (_extConn, data) => {
//       if (data.entityName === 'account') {
//         const a = data.entity
//         return {
//           id: `${a.id}`,
//           entityName: 'account',
//           entity: identity<Standard.Account>({
//             name: `FR ${data.entity.name ?? ''}`,
//             type: ((): Standard.AccountType => {
//               switch (a.type) {
//                 case 'Cash':
//                   return 'asset/cash'
//                 case 'Chequing':
//                 case 'Saving':
//                 case 'Debit Card':
//                   return 'asset/bank'
//                 case 'Credit Card':
//                   return 'liability/credit_card'
//                 case 'Loan':
//                   return 'liability/personal_loan'
//                 default:
//                   return 'asset'
//               }
//             })(),
//             defaultUnit: a.currency as Unit,
//           }),
//         }
//       } else if (data.entityName === 'transaction') {
//         const t = data.entity.content
//         const c = data.info
//         const meta = data.entity
//         const creator = c?.memberByGuid?.[meta.user_guid]
//         return {
//           id: data.id,
//           entityName: 'transaction',
//           entity: identity<Standard.Transaction>({
//             date: data.entity.content.receipt_date,
//             payee: data.entity.content.merchant,
//             description: t.notes ?? '',
//             // TODO: Split transactions should be handled via deleting one of the receipts in Alka
//             removed: t.status === 'Deleted',
//             postingsMap: makePostingsMap({
//               main: {
//                 accountExternalId: `${c?._id}-${t.account_id}` as Id.external,
//                 amount: A(
//                   (t.type === makeForeceiptClient(_extConn).EXPENSE_TYPE ||
//                   t.type === makeForeceiptClient(_extConn).TRANSFER_TYPE
//                     ? -1
//                     : 1) * t.amount,
//                   t.currency,
//                 ),
//               },
//               remainder: {
//                 accountExternalId:
//                   t.type === makeForeceiptClient(_extConn).TRANSFER_TYPE
//                     ? (`${c?._id}-${t.account1_id}` as Id.external)
//                     : undefined,
//                 accountType: ((): Standard.AccountType => {
//                   switch (t.type) {
//                     case makeForeceiptClient(_extConn).EXPENSE_TYPE:
//                       return 'expense'
//                     case makeForeceiptClient(_extConn).INCOME_TYPE:
//                       return 'income'
//                     // eslint-disable-next-line unicorn/no-useless-switch-case
//                     case makeForeceiptClient(_extConn).TRANSFER_TYPE:
//                     default:
//                       return 'equity/clearing'
//                   }
//                 })(),
//               },
//             }),
//             attachmentsMap: objectFromArray(
//               t.image_file_list,
//               (file) => file,
//               (file) => ({
//                 url: `https://api.foreceipt.io/v1/receipt/image/${t.image_folder}/${file}`,
//               }),
//             ),
//             labelsMap: {
//               ...objectFromArray(
//                 t.tags ?? [],
//                 (tag) => tag,
//                 () => true,
//               ),
//               for_business: t.for_business ?? false, // Should this be label?
//             },
//             custom: {
//               ...(c?.team && {
//                 created_by: compact([
//                   creator?.first_name,
//                   creator?.last_name,
//                 ]).join(' '),
//               }),
//             },
//             externalCategory:
//               c?.categoryNameById[
//                 compact([t.category_id, t.sub_category_id]).join('/')
//               ],
//           }),
//         }
//       }
//       return null
//     },
//   }),
//   name: 'foreceipt',
//   connectInput: zForeceiptConfig,
//   connectOutput: zForeceiptConfig,
//   sourceSyncOptions: zForeceiptConfig,
// })

// export const foreceiptProvider = makeSyncProvider({
//   ...base,
//   useConnectHook: (_type) => (_opts) =>
//     new Deferred<NonNullable<typeof _type>['connOutput']>().promise,
//   // TODO: Handle this use connect if it's necessary
//   // useConnectHook: (_type) => {
//   //   const [_isShowPromt, setIsShowPromt] = React.useState(false)

//   //   const [deferred] = React.useState(
//   //     new Deferred<NonNullable<typeof _type>['connOutput']>(),
//   //   )

//   // React.useEffect(() => {
//   //   if(isShowPromt) {
//   //     deferred.resolve({credentials})
//   //   }
//   // }, [isShowPromt, deferred])

//   //   return (_opts) => {
//   //     setIsShowPromt(true)
//   //     return deferred.promise
//   //   }
//   // },

//   postConnect: (input) =>
//     rxjs.of(input).pipe(
//       Rx.mergeMap((_res) => {
//         const conn = identity<z.infer<typeof base['connectionSettings']>>({
//           ...input,
//         })
//         const sync$: rxjs.Observable<ForeceiptSyncOperation> =
//           foreceiptProvider.sourceSync({settings: conn, options: conn})
//         return rxjs.concat(sync$)
//       }),
//     ),
//     sourceSync: (_p) => rxjs.EMPTY
//   // sourceSync: ({options}) => {
//   //   // TODO: Keep the watchChanges for now until make it works
//   //   const client = makeForeceiptClient(options)
//   //   const raw$ = rxjs.from(client.initFb()).pipe(
//   //     Rx.mergeMap((fb) => {
//   //       console.log(fb, '===firebase init ===')
//   //       return rxjs
//   //         .from(client.getQuery$())
//   //         .pipe(
//   //           Rx.mergeMap((q) =>
//   //             firebaseProvider.sourceSync({
//   //               options: {} as any,
//   //               conn: {
//   //                 authUserJson: fb.authUserJson,
//   //                 publicConfig: client.fbaConfig,
//   //                 _fb: fb,
//   //                 _queries: [q],
//   //               },
//   //             }),
//   //           ),
//   //         )
//   //         .pipe(
//   //           Rx.map((op) =>
//   //             // TODO: Continue to handle the data
//   //             // op.type === 'data'
//   //             //   ? _op({
//   //             //       type: 'data',
//   //             //       data: {
//   //             //         entity: op.data.entity as Foreceipt.Receipt,
//   //             //         entityName: 'transaction',
//   //             //       },
//   //             //     })
//   //             //   :
//   //             rxjs.of(op),
//   //           ),

//   //           Rx.mergeMap((_o) => rxjs.from([_op({type: 'commit'})])),
//   //         )
//   //     }),
//   //   )

//   //   return raw$.pipe(Rx.mergeMap((op) => rxjs.of(op)))

//   //   /*
//   //   Oldd watchanges as references

//   //   async function watchChanges() {
//   //     const foreceipt = makeForeceiptClient(options)
//   //     const [userAndTeam, settings] = await Promise.all([
//   //       foreceipt.getUserAndTeamInfo(),
//   //       foreceipt.getUserSettings(),
//   //     ])
//   //     const info = _parseConnectionInfo(userAndTeam, settings)

//   //     const receipt$ = foreceipt.getReceiptsSnapshot$(undefined).pipe(
//   //       Rx.mergeMap((snap) => {
//   //         const docs = snap.docChanges().map((c) => ({
//   //           _docId: c.doc.id,
//   //           ...(c.doc.data() as Foreceipt.Receipt),
//   //         }))
//   //         return docs.map(
//   //           (r) =>
//   //             _op({
//   //               type: 'data',
//   //               data: {
//   //                 id: r.content.id ?? r._docId,
//   //                 entity: {
//   //                   ...r,
//   //                   create_time: serializeTimestamp(r.create_time),
//   //                   last_update_time: serializeTimestamp(r.last_update_time),
//   //                 },
//   //                 entityName: 'transaction',
//   //                 info,
//   //               },
//   //             }),
//   //           _op({type: 'commit'}),
//   //         )
//   //       }),
//   //     )
//   //     const account$ = foreceipt.getUserSettings$().pipe(
//   //       Rx.mergeMap((_settings) =>
//   //         _parseAccounts(options, settings).map(
//   //           (a) =>
//   //             _op({
//   //               type: 'data',
//   //               data: {
//   //                 id: a._id,
//   //                 entity: a.data,
//   //                 entityName: 'account',
//   //                 info,
//   //               },
//   //             }),
//   //           _op({type: 'commit'}),
//   //         ),
//   //       ),
//   //     )
//   //     return rxjs.merge(receipt$, account$)
//   //   }

//   //   return rxjs.from(watchChanges()).pipe(Rx.mergeMap((ops) => rxjs.from(ops)))


//   //   */
//   //   /*
//   //   async function* iterateEntities() {
//   //     const foreceipt = makeForeceiptClient({
//   //       ...options,
//   //     })
//   //     const [userAndTeam, settings] = await Promise.all([
//   //       foreceipt.getUserAndTeamInfo(),
//   //       foreceipt.getUserSettings(),
//   //     ])
//   //     const info = _parseConnectionInfo(userAndTeam, settings)
//   //     const accounts = _parseAccounts(options, info.settings)
//   //     yield accounts.map((a) =>
//   //       _op({
//   //         type: 'data',
//   //         data: {id: a._id, entity: a.data, entityName: 'account', info},
//   //       }),
//   //     )

//   //     const receipts = await foreceipt.getReceipts(undefined)
//   //     yield receipts.map((r) =>
//   //       _op({
//   //         type: 'data',
//   //         data: {
//   //           id: `${r.content.id ?? r._docId}` as Id.external,
//   //           entity: {
//   //             ...r,
//   //             create_time: serializeTimestamp(r.create_time),
//   //             last_update_time: serializeTimestamp(r.last_update_time),
//   //           },
//   //           entityName: 'transaction',
//   //           info,
//   //         },
//   //       }),
//   //     )
//   //   }
//   //   return rxjs
//   //     .from(iterateEntities())
//   //     .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, _op({type: 'commit'})]))) */
//   // },
// })

// // const _op: typeof identity<ForeceiptSyncOperation> = identity
