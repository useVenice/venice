'use client'

import {trpcReact} from '@usevenice/engine-frontend/TRPCProvider'
import {Button, ZodForm} from '@usevenice/ui'
import {z} from '@usevenice/util'
import {useForm} from 'react-hook-form'
import {NoSSR} from '../../../components/NoSSR'

// TODO: Enable better sharing of schemas between client & server
// However we don't necessiarly want the procedure themselves to be imported to the client
// for performance reasons, but it would be awfully handy to have automatic forms generated
// for any trpc mutation! For now we will have to duplicate the form defs...
// @see https://github.com/trpc/trpc/discussions/714
// Also router._def.procedures.adminCreateConnectToken._def.inputs[0]
const formSchema = z.object({name: z.string(), slug: z.string()})

export function Workspaces() {
  const trpcUtils = trpcReact.useContext()

  const workspacesRes = trpcReact.adminListWorkspaces.useQuery({})
  const upsertWorkspace = trpcReact.adminUpsertWorkspace.useMutation({
    onSuccess: () => {
      void trpcUtils.adminListWorkspaces.invalidate()
    },
  })
  const form = useForm<z.infer<typeof formSchema>>()
  console.log('workspaces', workspacesRes.data)

  return (
    <div className="flex h-screen w-screen items-center">
      <div className="mx-auto max-w-xs">
        <h1>Workspaces</h1>
        <ul
          // onValueChange={(value) => setSelectedName(value)}
          // placeholder="Select workspace"
          className="max-w-xs list-inside list-disc">
          {(workspacesRes.data ?? []).map((item) => (
            <li key={item.name}>{item.name}</li>
            // <DropdownItem key={item.name} value={item.name} text={item.name} />
          ))}
        </ul>
      </div>

      <div className="mx-auto max-w-xs">
        {/* Skip SSR as zodForm uses random id for htmlFor attribute which causes hydration issues.  */}
        <NoSSR>
          <ZodForm
            form={form}
            schema={formSchema}
            onSubmit={(values) =>
              upsertWorkspace.mutate(values, {
                // onSuccess: async (data) => {},
              })
            }
            renderAfter={({submit}) => (
              <div className="mt-8 flex justify-center gap-4">
                <Button
                  onClick={submit}
                  disabled={upsertWorkspace.isLoading}
                  className="min-w-[6rem] rounded-lg px-3 py-2 text-sm text-offwhite ring-1 ring-inset ring-venice-black-400 transition-colors hover:bg-venice-black-400 focus:outline-none focus-visible:bg-venice-black-400 disabled:opacity-30">
                  {upsertWorkspace.isLoading ? (
                    <span>Creating...</span>
                  ) : (
                    <span>Create workspace</span>
                  )}
                </Button>
              </div>
            )}
          />
        </NoSSR>
      </div>
    </div>
  )
}
