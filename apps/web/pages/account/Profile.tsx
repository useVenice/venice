import {useMutation} from '@tanstack/react-query'
import {Button, CircularProgress, Input} from '@usevenice/ui'
import {FrownIcon} from '@usevenice/ui/icons'
import {useRouter} from 'next/router'
import {browserSupabase} from '../../contexts/common-contexts'

interface ProfileProps {
  username: string
}

export function Profile(props: ProfileProps) {
  const router = useRouter()
  const logout = useMutation<void, Error>(async () => {
    await browserSupabase.auth.signOut()
    await router.push('/auth')
  })

  return (
    <form
      className="flex flex-col items-start gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        logout.mutate()
      }}>
      <div className="grid w-full max-w-[20rem] gap-3">
        <Input value={props.username} readOnly />
      </div>
      <Button variant="primary" className="gap-2" disabled={logout.isLoading}>
        {logout.isLoading ? (
          <CircularProgress className="h-4 w-4 fill-offwhite text-offwhite/50" />
        ) : (
          <FrownIcon className="h-4 w-4 fill-current" />
        )}
        Log out
      </Button>
    </form>
  )
}
