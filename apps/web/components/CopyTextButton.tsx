import {Button} from '@usevenice/ui'
import {CheckCircleFilledIcon, CopyTextIcon} from '@usevenice/ui/icons'
import {useEffect, useState} from 'react'
import {copyToClipboard} from '../contexts/common-contexts'

interface CopyTextButtonProps {
  content: string
  showCopiedDurationMs?: number
  onCopied?: () => unknown
}

export function CopyTextButton(props: CopyTextButtonProps) {
  const {content, showCopiedDurationMs = 2000} = props
  const [isCopied, setCopied] = useState(false)
  const {icon: Icon, text} = isCopied
    ? {icon: CheckCircleFilledIcon, text: 'Copied'}
    : {icon: CopyTextIcon, text: 'Copy'}

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setCopied(false), showCopiedDurationMs)
      return () => clearTimeout(timer)
    }
    return
  }, [isCopied, showCopiedDurationMs])

  return (
    <Button
      variant="primary"
      disabled={isCopied}
      onClick={async () => {
        await copyToClipboard(content)
        setCopied(true)
        props.onCopied?.()
      }}
      className="shrink-0 gap-1 disabled:opacity-100">
      <Icon className="h-4 w-4 fill-current" />
      <span>{text}</span>
    </Button>
  )
}
