import {Merge} from '@ledger-sync/util'
import React from 'react'

export namespace Polymorphic {
  export type PropsWithRef<E, TOwnProps = {}> = Merge<
    E extends React.ComponentType<infer P>
      ? P
      : E extends React.ElementType
      ? React.ComponentPropsWithRef<E>
      : never,
    Merge<TOwnProps, {as?: E}>
  >

  export type PropsWithoutRef<E, TOwnProps = {}> = Merge<
    E extends React.ComponentType<infer P>
      ? Omit<P, 'ref'>
      : E extends React.ElementType
      ? React.ComponentPropsWithoutRef<E>
      : never,
    Merge<TOwnProps, {as?: E}>
  >

  export interface ForwardRefComponent<E, TOwnProps>
    extends React.ForwardRefExoticComponent<
      Omit<PropsWithRef<E, TOwnProps>, 'as'>
    > {
    <
      TAs extends
        | keyof JSX.IntrinsicElements
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        | React.JSXElementConstructor<any>,
    >(
      props: PropsWithRef<TAs, TOwnProps> & {as: TAs},
    ): React.ReactElement | null
  }

  export interface MemoComponent<E, TOwnProps>
    extends React.MemoExoticComponent<
      React.ComponentType<Omit<PropsWithoutRef<E, TOwnProps>, 'as'>>
    > {
    <
      TAs extends
        | keyof JSX.IntrinsicElements
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        | React.JSXElementConstructor<any>,
    >(
      props: PropsWithoutRef<TAs, TOwnProps> & {as: TAs},
    ): React.ReactElement | null
  }
}
