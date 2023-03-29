import {Button, CircularProgress, Input} from '@usevenice/ui'
import {EditIcon} from '@usevenice/ui/icons'
import {useForm} from 'react-hook-form'

interface SecurityFormData {
  currentPassword: string
  newPassword: string
  newPasswordConfirm: string
}

export function Security() {
  const {register, handleSubmit, formState} = useForm<SecurityFormData>({
    reValidateMode: 'onBlur',
  })
  return (
    <form
      className="flex flex-col items-start gap-6"
      onSubmit={handleSubmit(async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log('Successfully update password', data)
      })}>
      <div className="grid w-full max-w-[20rem] gap-3">
        <Input
          {...register('currentPassword', {
            required: 'Cannot be empty.',
          })}
          type="password"
          placeholder="current password"
          errorMessage={formState.errors.currentPassword?.message}
        />
        <Input
          {...register('newPassword', {
            required: 'Cannot be empty.',
          })}
          type="password"
          placeholder="new password"
          errorMessage={formState.errors.newPassword?.message}
        />
        <Input
          {...register('newPasswordConfirm', {
            required: 'Cannot be empty.',
            validate: (value, formValues) =>
              value === formValues.newPassword || 'New password mismatched.',
          })}
          type="password"
          placeholder="confirm new password"
          errorMessage={formState.errors.newPasswordConfirm?.message}
        />
      </div>
      <Button
        variant="primary"
        className="gap-2"
        disabled={formState.isSubmitting}>
        {formState.isSubmitting ? (
          <CircularProgress className="h-4 w-4 fill-offwhite text-offwhite/50" />
        ) : (
          <EditIcon className="h-4 w-4 fill-current" />
        )}
        Save
      </Button>
    </form>
  )
}
