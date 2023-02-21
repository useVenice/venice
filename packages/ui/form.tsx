import {useTsController, createTsForm} from '@ts-react/form'
import type {PropsMapping} from '@ts-react/form/lib/src/createSchemaForm'
import {titleCase, z} from '@usevenice/util'
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from './components'
import {Label} from './components/Label'
import useConstant from './hooks/useConstant'

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

function StringField(props: FieldProps) {
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

function EnumField({enumValues, label, name}: FieldProps) {
  const {field, error} = useTsController<string>()
  const id = useConstant(() => `enum-${Math.random()}`)
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
    </>
  )
}

function NumberField({req}: {req: number; zodType?: string}) {
  const {
    field: {onChange, value},
    error,
  } = useTsController<number>()
  return (
    <>
      <span>
        <span>{`req is ${req}`}</span>
        <input
          value={value !== undefined ? value + '' : ''}
          onChange={(e) => {
            const value = Number.parseInt(e.target.value)
            if (isNaN(value)) onChange(undefined)
            else onChange(value)
          }}
        />
        {error && error.errorMessage}
      </span>
    </>
  )
}

// function Checkbox({name}: {name: string}) {
//   const {
//     field: {onChange, value},
//   } = useTsController<boolean>()

//   return (
//     <label>
//       {name}
//       <input
//         onChange={(e) => onChange(e.target.checked)}
//         checked={value ? value : false}
//         type="checkbox"
//       />
//     </label>
//   )
// }
function MultiCheckbox({...props}: FieldProps) {
  console.log('multi checkbox props', props)
  console.log(props.zodType)
  const enumValues =
    props.enumValues ??
    ((props.zodType instanceof z.ZodArray &&
      props.zodType.element instanceof z.ZodEnum &&
      (props.zodType.element.options as string[])) ||
      [])
  const {
    field: {onChange, value},
  } = useTsController<string[]>()

  function toggleField(option: string) {
    if (!value) onChange([option])
    else {
      onChange(
        value.includes(option)
          ? value.filter((e) => e !== option)
          : [...value, option],
      )
    }
  }

  return (
    <>
      {enumValues.map((optionValue) => (
        <label
          htmlFor={optionValue}
          style={{display: 'flex', flexDirection: 'row'}}
          key={optionValue}>
          {optionValue}
          <input
            name={optionValue}
            type="checkbox"
            onChange={() => toggleField(optionValue)}
            checked={value?.includes(optionValue) ? true : false}
          />
        </label>
      ))}
    </>
  )
}

const mapping = [
  // z.number() is also viable. You'll probably have to use "createUniqueFieldSchema" (since you probably already have a Text Field)
  [z.string(), StringField],
  [z.enum(['placeholder']), EnumField],
  [z.number(), NumberField],
  [z.array(z.enum(['placeholder'])), MultiCheckbox],
] as const

// as never workaround to make sure props type inference is not broken
const Form = createTsForm(mapping, {propsMap} as never)

const MyForm = z.object({
  eyeColor: z.enum(['blue', 'red', 'green']),
  eyeColors: z.array(z.enum(['blue', 'red', 'green'])),
  favoritePants: z.string().min(5).describe('Fav pants // Do something'),
  ad: z.number().min(5),
})

export function MyPage() {
  return (
    <Form
      schema={MyForm}
      onSubmit={(vals) => {
        console.log('values', vals)
      }}
      renderAfter={() => <button>Submit</button>}
      props={{
        ad: {req: 12, zodType: ''},
        eyeColor: {
          zodType: MyForm.shape.eyeColor,
          // options: ['blue', 'red', 'green'],
        },
        eyeColors: {
          zodType: MyForm.shape.eyeColors,
          // zodType: '',
        },
        favoritePants: {
          // options: ['khakis', 'blue jeans'],
        },
      }}
    />
  )
}
