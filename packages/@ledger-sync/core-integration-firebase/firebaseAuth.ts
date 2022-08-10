import {z, zFunction} from '@alka/util'
// eslint-disable-next-line import/no-extraneous-dependencies
import {UserImpl} from '@firebase/auth/internal'
import firebase from 'firebase/compat/app'

export const zFirebaseConfig = z.object({
  projectId: z.string(),
  apiKey: z.string(),
  appId: z.string(),
  authDomain: z.string(),
  databaseURL: z.string(),
  storageBucket: z.string().optional(),
  measurementId: z.string().optional(),
  messagingSenderId: z.string().optional(),
})

/**
 * Can be obtained by executing the following in the browser
 * `console.log(JSON.stringify(fba.auth().currentUser.toJSON(), null, 2))`
 */
export type AuthUserJson = z.infer<typeof zAuthUserJson>
export const zAuthUserJson = z
  .object({
    uid: z.string(),
    appName: z.string(),
    stsTokenManager: z.record(z.unknown()),
  })
  .catchall(z.unknown())

export const zAuthData = z.discriminatedUnion('method', [
  z.object({method: z.literal('userJson'), userJson: zAuthUserJson}),
  z.object({method: z.literal('customToken'), customToken: z.string()}),
  z.object({
    method: z.literal('emailPassword'),
    email: z.string(),
    password: z.string(),
  }),
])

export const zFirebaseUserConfig = z.object({
  firebaseConfig: zFirebaseConfig,
  authData: zAuthData,
})

export const makeFirebaseAuth = zFunction(zFirebaseConfig, (config) => {
  const fba = firebase.initializeApp(config, config.projectId)
  const auth = fba.auth()

  const getUser = () => {
    if (!auth.currentUser) {
      throw new Error('auth.currentUser missing')
    }
    return auth.currentUser
  }
  return {
    fba,
    auth,
    currentUserJson: zFunction(() => getUser().toJSON()),
    login: zFunction(zAuthData, async (input) => {
      const res = await (input.method === 'userJson'
        ? authUpdateCurrentUserFromJSON(auth, input.userJson)
        : input.method === 'customToken'
        ? auth.signInWithCustomToken(input.customToken)
        : auth.signInWithEmailAndPassword(input.email, input.password))
      return res.user?.toJSON()
    }),
    logout: zFunction(() => auth.signOut()),
    resetPassword: zFunction(z.string(), (email) =>
      auth.sendPasswordResetEmail(email),
    ),
    updatePassword: zFunction(z.string(), (pw) => getUser().updatePassword(pw)),
    verifyBeforeUpdateEmail: zFunction(z.string(), (email) =>
      getUser().verifyBeforeUpdateEmail(email),
    ),
  }
})

/**
 * Hacky solution to update the current user
 * @deprecated Every one should instead use makeFirebaseAuth
 */
export async function authUpdateCurrentUserFromJSON(
  auth: firebase.auth.Auth,
  uJson: Record<string, unknown>,
) {
  if (!uJson || !uJson['uid']) {
    console.error('Invalid user in authUpdateCurrentUserFromJSON', uJson)
    throw new Error('Invalid user')
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = UserImpl._fromJSON((auth as any)._delegate, uJson)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await auth.updateCurrentUser(user as any)
  return {user: auth.currentUser}
}
