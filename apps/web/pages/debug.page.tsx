import {plaidProvider} from '@usevenice/app-config/env'
import {
  CheckboxGroup,
  CheckboxGroupItem,
  Input,
  MyPage,
  RadioGroup,
  RadioGroupItem,
  ZodForm,
} from '@usevenice/ui'

const Divider = () => <hr className="mt-2" />

export default function DebugPage() {
  if (true) {
    return <MyPage />
  }
  return (
    <div className="p-8">
      <Input />
      <Divider />
      <RadioGroupDemo />
      <Divider />
      <CheckboxDemo />
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
    <RadioGroup
      label="Environment"
      defaultValue="development"
      orientation="horizontal">
      <RadioGroupItem value="sandbox" />
      <RadioGroupItem value="development" />
      <RadioGroupItem value="production" />
    </RadioGroup>
  )
}

export function CheckboxDemo() {
  return (
    <CheckboxGroup label="Country code" orientation="horizontal">
      <CheckboxGroupItem value="US" />
      <CheckboxGroupItem value="UK" />
      <CheckboxGroupItem value="Canada" />
    </CheckboxGroup>
  )
}
