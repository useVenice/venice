'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
} from '@tremor/react'

interface Column<T> {
  key: Extract<keyof T, string> | `$${string}`
  title?: string
  render?: (item: T) => React.ReactNode
}

export function SchemaTable<
  T extends {id: string},
  TC extends Array<Column<T>>,
>(props: {items: T[]; columns: TC}) {
  return (
    // overflow-x-scroll Didn't work. Ideally we would like to always show a table with scrollbar
    <Table className="mt-5">
      <TableHead>
        <TableRow>
          {props.columns.map((column) => (
            <TableHeaderCell key={column.key}>
              {column.title ?? column.key}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {props.items.map((item) => (
          <TableRow key={item.id}>
            {props.columns.map((column) => (
              <TableCell key={column.key}>
                {column.render ? (
                  column.render(item)
                ) : (
                  <Text>{`${item[column.key as keyof T] ?? ''}`}</Text>
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
