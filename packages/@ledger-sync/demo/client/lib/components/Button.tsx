import {styled} from '../stitches.config'

export const Button = styled('button', {
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
