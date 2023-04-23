'use client'

import {VeniceProvider} from '@usevenice/engine-frontend'
import {Button, ZodForm} from '@usevenice/ui'
import {z} from '@usevenice/util'
import {useForm} from 'react-hook-form'

// TODO: Enable better sharing of schemas between client & server
// However we don't necessiarly want the procedure themselves to be imported to the client
// for performance reasons, but it would be awfully handy to have automatic forms generated
// for any trpc mutation! For now we will have to duplicate the form defs...
// @see https://github.com/trpc/trpc/discussions/714
// Also router._def.procedures.adminCreateConnectToken._def.inputs[0]
const formSchema = z.object({name: z.string(), slug: z.string()})

export default function Workspaces() {
  const {trpc} = VeniceProvider.useContext()
  const trpcUtils = trpc.useContext()

  const workspacesRes = trpc._wipListWorkspaces.useQuery({})
  const createWorkspace = trpc._wipCreateWorkspace.useMutation({
    onSuccess: () => {
      void trpcUtils._wipListWorkspaces.invalidate()
    },
  })
  const form = useForm<z.infer<typeof formSchema>>()

  return (
    <div className="flex h-screen w-screen items-center">
      <div className="mx-auto max-w-xs">
        <ul
          // onValueChange={(value) => setSelectedName(value)}
          // placeholder="Select workspace"
          className="max-w-xs">
          {(workspacesRes.data ?? []).map((item) => (
            <li key={item.name}>{item.name}</li>
            // <DropdownItem key={item.name} value={item.name} text={item.name} />
          ))}
        </ul>
      </div>

      <div className="mx-auto max-w-xs">
        <ZodForm
          form={form}
          schema={formSchema}
          onSubmit={(values) =>
            createWorkspace.mutate(values, {
              // onSuccess: async (data) => {},
            })
          }
          renderAfter={({submit}) => (
            <div className="mt-8 flex justify-center gap-4">
              <Button
                onClick={submit}
                disabled={createWorkspace.isLoading}
                className="min-w-[6rem] rounded-lg px-3 py-2 text-sm text-offwhite ring-1 ring-inset ring-venice-black-400 transition-colors hover:bg-venice-black-400 focus:outline-none focus-visible:bg-venice-black-400 disabled:opacity-30">
                {createWorkspace.isLoading ? (
                  <span>Creating...</span>
                ) : (
                  <span>Create magic link</span>
                )}
              </Button>
            </div>
          )}
        />
      </div>
    </div>
  )
}
