import type {ComponentPropsWithoutRef} from 'react'

type ExternalLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'rel' | 'target'>

export function ExternalLink(props: ExternalLinkProps) {
  return <a {...props} target="_blank" rel="noopener noreferrer" />
}
