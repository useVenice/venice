'use client'

import Link from 'next/link'
import {useForm} from 'react-hook-form'

import {trpcReact} from '@usevenice/engine-frontend/TRPCProvider'
import {Button, ZodForm} from '@usevenice/ui'
import {z} from '@usevenice/util'

import {NoSSR} from '@/components/NoSSR'
import {RedirectToNext13} from '@/components/RedirectTo'

// TODO: Enable better sharing of schemas between client & server
// However we don't necessiarly want the procedure themselves to be imported to the client
// for performance reasons, but it would be awfully handy to have automatic forms generated
// for any trpc mutation! For now we will have to duplicate the form defs...
// @see https://github.com/trpc/trpc/discussions/714
// Also router._def.procedures.adminCreateConnectToken._def.inputs[0]
const formSchema = z.object({name: z.string(), slug: z.string()})

export default function WorkspacesList() {
  const trpcUtils = trpcReact.useContext()

  const workspacesRes = trpcReact.adminListWorkspaces.useQuery({})

  const createWorkspace = trpcReact.adminCreateWorkspace.useMutation({
    onSuccess: () => {
      void trpcUtils.adminListWorkspaces.invalidate()
    },
  })
  const form = useForm<z.infer<typeof formSchema>>()
  console.log('workspaces', workspacesRes.data, workspacesRes)

  // Doing this client side otherwise we need separate server component...
  const firstWorkspace = workspacesRes.data?.[0]
  if (workspacesRes.data?.length === 1 && firstWorkspace) {
    return (
      <RedirectToNext13 url={`/workspaces/${firstWorkspace.slug}`}>
        <div>Redirecting to {firstWorkspace.name}</div>
      </RedirectToNext13>
    )
  }
  return (
    <div className="flex h-screen w-screen items-center">
      <div className="mx-auto max-w-xs">
        <h1>Workspaces</h1>
        <ul
          // onValueChange={(value) => setSelectedName(value)}
          // placeholder="Select workspace"
          className="max-w-xs list-inside list-disc">
          {(workspacesRes.data ?? []).map((ws) => (
            <li key={ws.id}>
              <Link href={`/workspaces/${ws.slug}`}>{ws.name}</Link>
            </li>
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
