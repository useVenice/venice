import {useTsController, createTsForm} from '@ts-react/form'
import type {PropsMapping} from '@ts-react/form/lib/src/createSchemaForm'
import {deepMerge, R, titleCase, z} from '@usevenice/util'
import {
  Checkbox,
  CheckboxGroup,
  CheckboxGroupItem,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from './components'
import {Label} from './components/Label'
import {useConstant} from './hooks/useConstant'

/** https://github.com/iway1/react-ts-form/blob/main/API.md#createtsform-params */

const propsMap: PropsMapping = [
  ['name', 'name'],
  ['control', 'control'],
  ['enumValues', 'enumValues'],
  ['descriptionLabel', 'label'],
  ['descriptionPlaceholder', 'placeholder'],
]
/** Result of propsMap */
interface FieldProps {
  zodType?: z.ZodType
  /** - the name of the input (the property name in your zod schema).  */
  name: string
  /** - the react hook form control  */
  control?: unknown
  /** - (deprecated) enumValues extracted from your zod enum schema.  */
  enumValues?: string[]
  /** - The label extracted from .describe()  */
  label?: string
  /** - The placeholder extracted from .describe()  */
  placeholder?: string
}

export function TextField(props: FieldProps) {
  const {field, error} = useTsController<string>()
  return (
    <Input
      label={props.label ?? titleCase(props.name)}
      placeholder={props.placeholder}
      value={field.value}
      onChange={(e) => field.onChange(e.target.value)}
      errorMessage={error?.errorMessage}
    />
  )
}

export function CheckboxField({label, name}: FieldProps) {
  const {field, error} = useTsController<boolean>()
  const id = useConstant(() => `checkbox-${Math.random()}`)
  return (
    <>
      <Label className="mr-2" htmlFor={id}>
        {label ?? titleCase(name)}
      </Label>
      <Checkbox
        className="mb-2"
        checked={field.value}
        onCheckedChange={(state) => field.onChange(!!state)}
      />
      <span>{error?.errorMessage && error.errorMessage}</span>
    </>
  )
}

export function SelectField({enumValues, label, name}: FieldProps) {
  const {field, error} = useTsController<string>()
  const id = useConstant(() => `select-${Math.random()}`)
  // NOTE the htmlFor and id field does not currently work
  // not even sure if it is meant to work with radix select component at all
  // Though it seems to be supported in the html layer.
  return (
    <>
      <Label htmlFor={id}>{label ?? titleCase(name)}</Label>
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger className="max-w-[10rem]" />
        <SelectContent id={id}>
          {enumValues?.map((e) => (
            <SelectItem key={e} value={e}>
              {titleCase(e)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span>{error?.errorMessage && error.errorMessage}</span>
      {/* Workaround for not having className on Select component... */}
      <div className="mb-2" />
    </>
  )
}

export function RadioGroupField({enumValues, label, name}: FieldProps) {
  const {field, error} = useTsController<string>()

  // NOTE the htmlFor and id field does not currently work
  // not even sure if it is meant to work with radix select component at all
  // Though it seems to be supported in the html layer.
  return (
    <>
      <RadioGroup
        label={label ?? titleCase(name)}
        value={field.value}
        onValueChange={field.onChange}
        orientation="horizontal"
        className="m-2">
        {enumValues?.map((e) => (
          <RadioGroupItem key={e} value={e}>
            {titleCase(e)}
          </RadioGroupItem>
        ))}
      </RadioGroup>
      <span>{error?.errorMessage && error.errorMessage}</span>
    </>
  )
}

export function CheckboxGroupField({...props}: FieldProps) {
  const enumValues =
    props.enumValues ??
    ((props.zodType instanceof z.ZodArray &&
      props.zodType.element instanceof z.ZodEnum &&
      (props.zodType.element.options as string[])) ||
      [])
  const {field, error} = useTsController<string[]>()

  return (
    <>
      <CheckboxGroup
        label={props.label ?? titleCase(props.name)}
        orientation="horizontal"
        className="m-2">
        {enumValues.map((v) => (
          <CheckboxGroupItem
            key={v}
            value={v}
            checked={field.value?.includes(v)}
            onCheckedChange={(checked) =>
              field.onChange(
                checked
                  ? [...(field.value ?? []), v]
                  : field.value?.filter((val) => val !== v),
              )
            }
          />
        ))}
      </CheckboxGroup>
      <span>{error?.errorMessage && error.errorMessage}</span>
    </>
  )
}

const mapping = [
  // z.number() is also viable. You'll probably have to use "createUniqueFieldSchema" (since you probably already have a Text Field)
  [z.string(), TextField],
  [z.boolean(), CheckboxField],
  [z.enum(['placeholder']), RadioGroupField],
  [z.array(z.enum(['placeholder'])), CheckboxGroupField],
] as const

// as never workaround to make sure props type inference is not broken
const TsForm = createTsForm(mapping, {propsMap} as never)

export const ZodForm: typeof TsForm = (props) => (
  <TsForm
    {...props}
    // TODO: make me work with effects by unwrapping at the top level
    props={deepMerge(
      props.props,
      R.mapValues((props.schema as z.AnyZodObject).shape, (_, key) => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        zodType: (props.schema as z.AnyZodObject).shape[key],
      })),
    )}
  />
)

//Testing

const schema = z.object({
  eyeColor: z.enum(['blue', 'red', 'green']),
  eyeColors: z.array(z.enum(['blue', 'red', 'green'])),
  favoritePants: z.string().min(5).describe('Fav pants // Do something'),
  // ad: z.number().min(5),
})

export function MyPage() {
  return (
    <ZodForm
      schema={schema}
      onSubmit={(vals) => {
        console.log('values', vals)
      }}
      // renderAfter={() => <button>Submit</button>}
      // props={{
      //   eyeColor: {
      //     zodType: MyForm.shape.eyeColor,
      //     // options: ['blue', 'red', 'green'],
      //   },
      //   eyeColors: {
      //     zodType: MyForm.shape.eyeColors,
      //     // zodType: '',
      //   },
      //   favoritePants: {
      //     // options: ['khakis', 'blue jeans'],
      //   },
      // }}
    />
  )
}
