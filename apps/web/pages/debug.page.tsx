import {ZodForm} from '@usevenice/ui'
import {z} from '@usevenice/util'

export default function DebugPage() {
  return (
    <div>
      <ZodForm
        schema={z.object({
          hello: z.string(),
          sup: z.enum(['hello', 'world']),
        })}
        initialValues={{hello: '', sup: 'world'}}></ZodForm>
    </div>
  )
}
