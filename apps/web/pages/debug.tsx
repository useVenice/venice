import {plaidProvider} from '@usevenice/app-config/providers'
import {VeniceProvider} from '@usevenice/engine-frontend'
import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  ZodForm,
} from '@usevenice/ui'
import type {GetServerSideProps} from 'next'
import {useState} from 'react'
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
  const [open, setOpen] = useState(false)

  console.log('open', open)

  return (
    <div className="p-9">
      <Button
        onClick={() => {
          openDialog(() => (
            <ZodForm
              schema={plaidProvider.def.preConnectInput}
              onSubmit={(vals) => {
                console.log('valu', vals)
              }}
              renderAfter={({submit}) => (
                <>
                  <DialogClose asChild>
                    <Button>Cancel</Button>
                  </DialogClose>
                  <Button onClick={submit}>Launch</Button>
                </>
              )}
            />
          ))
        }}>
        Show dialog
      </Button>
      <DialogRoot
        open={open}
        onOpenChange={(newOpen) => {
          console.log('onOpenChange', newOpen)
          setOpen(newOpen)
        }}>
        <DialogTrigger asChild>
          <Button>Edit Profile</Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          onPointerDownOutside={(e) => {
            console.log('pointer outside', e)
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
            {/* <DialogClose asChild> */}
            <Button onClick={() => setOpen(false)} type="submit">
              Save changes
            </Button>
            {/* </DialogClose> */}
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </div>
  )
}
