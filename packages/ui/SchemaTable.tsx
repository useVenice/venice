'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './new-components'

interface Column<T> {
  key: Extract<keyof T, string> | `$${string}`
  title?: string
  render?: (item: T) => React.ReactNode
}

export function SchemaTable<
  T extends {id: string},
  TC extends Array<Column<T>>,
>(props: {items: T[]; columns: TC; caption?: string; footer?: string}) {
  return (
    // overflow-x-scroll Didn't work. Ideally we would like to always show a table with scrollbar
    <Table className="mt-5">
      {props.caption && <TableCaption>{props.caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {props.columns.map((column) => (
            <TableHead key={column.key}>{column.title ?? column.key}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.items.map((item) => (
          <TableRow key={item.id}>
            {props.columns.map((column) => (
              <TableCell key={column.key}>
                {column.render
                  ? column.render(item)
                  : `${item[column.key as keyof T] ?? ''}`}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      {props.footer && <TableFooter>{props.footer}</TableFooter>}
    </Table>
  )
}
