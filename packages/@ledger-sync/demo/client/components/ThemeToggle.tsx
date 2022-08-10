import {objectKeys} from '@alka/util'
import {Half2Icon, MoonIcon, SunIcon} from '@radix-ui/react-icons'
import type {IconProps} from '@radix-ui/react-icons/dist/types'
import {LayoutGroup, motion} from 'framer-motion'
import {useTheme} from 'next-themes'
import React from 'react'
import {Grid, HStack, IconButton, styled} from '../lib'

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }
  return (
    <HStack
      justify="center"
      align="center"
      gap="sm"
      css={{
        backgroundColor: '$gray3',
        borderRadius: '$lg',
        paddingX: '$2',
        paddingY: '$1',
      }}>
      <LayoutGroup>
        {objectKeys(THEME_TO_BUTTON_INFO).map((theme) => (
          <ThemeButton key={theme} theme={theme} />
        ))}
      </LayoutGroup>
    </HStack>
  )
}

type Theme = 'system' | 'light' | 'dark'

interface ThemeButtonProps {
  theme: Theme
}

function ThemeButton({theme}: ThemeButtonProps) {
  const {theme: activeTheme, setTheme} = useTheme()
  const active = theme === activeTheme
  const IconComp = THEME_TO_BUTTON_INFO[theme]
  return (
    <Grid center css={{position: 'relative', height: 20}}>
      <StyledIconButton
        active={active}
        aria-label={`Change to ${theme} theme`}
        onClick={() => setTheme(theme)}>
        <IconComp />
      </StyledIconButton>

      {active ? <Circle layout layoutId="circle" /> : null}
    </Grid>
  )
}

const THEME_TO_BUTTON_INFO: Record<Theme, React.ComponentType<IconProps>> = {
  dark: MoonIcon,
  system: Half2Icon,
  light: SunIcon,
}

const Circle = styled(motion.div, {
  backgroundColor: '$gray5',
  borderRadius: '$full',
  height: 20,
  position: 'absolute',
  width: 20,
  zIndex: 1,
})

const StyledIconButton = styled(IconButton, {
  color: 'transparent',
  gridArea: ' 1 / 1 / 1 / 1',
  transitionProperty: 'box-shadow color',
  zIndex: 2,
  variants: {
    active: {
      true: {
        color: '$gray12',
      },
      false: {
        color: '$gray8',
      },
    },
  },
})
