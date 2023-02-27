import {plaidProvider} from '@usevenice/app-config/env'
import {VeniceProvider} from '@usevenice/engine-frontend'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ZodForm,
} from '@usevenice/ui'
import {GetServerSideProps} from 'next'
import {serverAnalytics} from '../lib/server-analytics'
import {serverGetUser} from '../server'

export const getServerSideProps = (async (ctx) => {
  const [user] = await serverGetUser(ctx)

  if (user) {
    serverAnalytics.track(user.id, {name: 'debug/debug', data: {}})
  }
  await serverAnalytics.flush()

  return {props: {}}
}) satisfies GetServerSideProps

export default function DebugPage() {
  const {openDialog} = VeniceProvider.useContext()

  console.log('plaidProvider.def', plaidProvider.def.preConnectInput.shape)
  // debugger
  return (
    <div className="p-9">
      <Button
        onClick={() => {
          openDialog(({close}) => (
            <ZodForm
              schema={plaidProvider.def.preConnectInput}
              onSubmit={(vals) => {
                console.log('valu', vals)
              }}
              renderAfter={({submit}) => (
                <>
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      close()
                    }}>
                    Cancel
                  </Button>
                  <Button onClick={submit}>Launch</Button>
                </>
              )}
            />
          ))
        }}>
        Show dialog
      </Button>
      <Dialog modal={false}>
        <DialogTrigger asChild>
          <Button>Edit Profile</Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={(e) => {
            e.preventDefault()
          }}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <ZodForm
            schema={plaidProvider.def.preConnectInput}
            onSubmit={(vals) => {
              console.log('valu', vals)
            }}
          />
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
