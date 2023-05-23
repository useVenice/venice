import {useToast} from '../new-components'

interface ToastOptions {
  title?: string
  description?: string
}

export function useWithToast(defaultOptions: ToastOptions = {}) {
  const {toast} = useToast()

  const onSuccessFn = (opts: ToastOptions) => () =>
    toast({
      variant: 'success',
      title: opts.title ?? 'Success',
      description: opts.description,
    })

  const onErrorFn = (opts: ToastOptions) => (err: unknown) =>
    toast({
      variant: 'destructive',
      title: `Error: ${err}`,
      description: opts.description,
    })

  const withToast = (
    fn: () => Promise<unknown>,
    options: ToastOptions = {},
  ) => {
    const opts = {...defaultOptions, ...options}
    return fn()
      .then((res) => {
        onSuccessFn(opts)()
        return res
      })
      .catch((err) => {
        onErrorFn(opts)(err)
      })
  }
  const onSuccess = onSuccessFn(defaultOptions)
  const onError = onErrorFn(defaultOptions)

  return {withToast, onSuccess, onError}
}
