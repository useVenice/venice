import {plaidProvider} from '@usevenice/app-config/env'
import {ZodForm, RadioGroup, RadioGroupItem} from '@usevenice/ui'

export default function DebugPage() {
  return (
    <div className="p-8">
      <RadioGroupDemo />
      <ZodForm
        schema={plaidProvider.def.integrationConfig}
        initialValues={{
          clientId: '',
          clientName: '',
          countryCodes: [],
          language: 'en',
          products: [],
          secrets: {},
        }}></ZodForm>
    </div>
  )
}

// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function RadioGroupDemo() {
  return (
    <RadioGroup label="Environment" defaultValue="development">
      <RadioGroupItem value="sandbox" />
      <RadioGroupItem value="development" />
      <RadioGroupItem value="production" />
    </RadioGroup>
  )
}
