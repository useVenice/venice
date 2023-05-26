import {useToast} from '../shadcn'

interface WithToastOptions {
  title?: string
  description?: string
  loadingTitle?: string
}

export function useWithToast(defaultOptions: WithToastOptions = {}) {
  const {toast} = useToast()

  const onSuccessFn = (opts: WithToastOptions) => () =>
    toast({
      variant: 'success',
      title: opts.title ?? 'Success',
      description: opts.description,
    })

  const onErrorFn = (opts: WithToastOptions) => (err: unknown) =>
    toast({
      variant: 'destructive',
      title: `Error: ${err}`,
      description: opts.description,
    })

  const withToast = (
    fn: () => Promise<unknown>,
    options: WithToastOptions = {},
  ) => {
    const opts = {...defaultOptions, ...options}
    const loading = toast({
      variant: 'loading',
      title: opts.loadingTitle ?? 'Running...',
    })
    return fn()
      .then((res) => {
        loading.dismiss()
        onSuccessFn(opts)()
        return res
      })
      .catch((err) => {
        loading.dismiss()
        onErrorFn(opts)(err)
      })
  }
  const onSuccess = onSuccessFn(defaultOptions)
  const onError = onErrorFn(defaultOptions)

  return {withToast, onSuccess, onError, toast}
}
