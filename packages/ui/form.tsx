import {useTsController, createTsForm} from '@ts-react/form'
import {z} from '@usevenice/util'

function TextField() {
  const {
    field: {onChange, value},
    error,
  } = useTsController<string>()

  return (
    <>
      <input
        onChange={(e) => onChange(e.target.value)}
        value={value ? value : ''}
      />
      {error && error.errorMessage}
    </>
  )
}

function NumberField({req}: {req: number}) {
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
// function MultiCheckbox({options}: {options: string[]}) {
//   const {
//     field: {onChange, value},
//   } = useTsController<string[]>()

//   function toggleField(option: string) {
//     if (!value) onChange([option])
//     else {
//       onChange(
//         value.includes(option)
//           ? value.filter((e) => e !== option)
//           : [...value, option],
//       )
//     }
//   }

//   return (
//     <>
//       {options.map((optionValue) => (
//         <label
//           htmlFor={optionValue}
//           style={{display: 'flex', flexDirection: 'row'}}
//           key={optionValue}>
//           {optionValue}
//           <input
//             name={optionValue}
//             type="checkbox"
//             onChange={() => toggleField(optionValue)}
//             checked={value?.includes(optionValue) ? true : false}
//           />
//         </label>
//       ))}
//     </>
//   )
// }

function Select({
  // options,
  enumValues,
}: {
  // options: string[]
  enumValues: string[]
}) {
  const {field, error} = useTsController<string>()
  return (
    <>
      <select
        value={field.value ? field.value : 'none'}
        onChange={(e) => {
          field.onChange(e.target.value)
        }}>
        {!field.value && <option value="none">Please select...</option>}
        {enumValues.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>
      <span>{error?.errorMessage && error.errorMessage}</span>
    </>
  )
}

const mapping = [
  // z.number() is also viable. You'll probably have to use "createUniqueFieldSchema" (since you probably already have a Text Field)
  [z.string(), TextField],
  [z.enum(['placeholder']), Select],
  [z.number(), NumberField],
] as const

const Form = createTsForm(mapping)

const MyForm = z.object({
  eyeColor: z.enum(['blue', 'red', 'green']),
  favoritePants: z.string().min(5),
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
        ad: {req: 12},
        eyeColor: {
          // options: ['blue', 'red', 'green'],
        },
        favoritePants: {
          // options: ['khakis', 'blue jeans'],
        },
      }}
    />
  )
}
