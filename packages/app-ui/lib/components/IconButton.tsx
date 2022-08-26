import {styled} from '../stitches.config'

/** Only used by IconButton. Otherwise we use Button from Supabase */
const Button = styled('button', {
  border: 'none',
  margin: 0,
  padding: 0,
  width: 'auto',
  overflow: 'visible',
  background: 'transparent',
  color: 'inherit',
  lineHeight: 'normal',
  fontSmooth: 'inherit',
  appearance: 'none',
  cursor: 'pointer',
  transition: '$default',
  transitionProperty: 'box-shadow',
  '&:focus': {
    outline: 'none',
    boxShadow: '$focus',
  },
})

export const IconButton = styled(Button, {
  borderRadius: '$sm',
  height: 16,
  width: 16,
})
