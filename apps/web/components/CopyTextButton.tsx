import {Button} from '@usevenice/ui'
import {CheckCircleFilledIcon, CopyTextIcon} from '@usevenice/ui/icons'
import {useEffect, useState} from 'react'

interface CopyTextButtonProps {
  content: string
  showCopiedDurationMs?: number
}

export function CopyTextButton(props: CopyTextButtonProps) {
  const {content, showCopiedDurationMs = 2000} = props
  const [isCopied, setCopied] = useState(false)
  const {icon: Icon, text} = isCopied
    ? {icon: CheckCircleFilledIcon, text: 'Copied'}
    : {icon: CopyTextIcon, text: 'Copy'}

  async function copyToClipboard() {
    if (navigator) {
      try {
        await navigator.clipboard.writeText(content)
        setCopied(true)
      } catch (err) {
        // TODO report via Sentry
        console.error('Unabled to copy content to clipboard.', err)
      }
    }
  }

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
      onClick={copyToClipboard}
      className="shrink-0 gap-1 disabled:opacity-100">
      <Icon className="h-4 w-4 fill-current" />
      <span>{text}</span>
    </Button>
  )
}
