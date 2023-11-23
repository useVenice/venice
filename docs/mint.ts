import apiPages from './api/index.json'

const mintConfig: MintConfig = {
  name: 'Venice',
  openapi: './venice.oas.json',
  logo: {
    light: '/images/logo/venice-black-logo.svg',
    dark: '/images/logo/venice-white-logo.svg',
  },
  favicon: '/images/favicon.png',
  colors: {
    primary: '#12B886',
    light: '#12B886',
    dark: '#12B886',
  },
  topbarLinks: [
    {
      name: 'Contact us',
      url: 'mailto:hi@venice.is',
    },
  ],
  topbarCtaButton: {
    name: 'Sign up',
    url: 'https://www.venice.is',
  },
  anchors: [
    {
      name: 'Community',
      icon: 'discord',
      url: 'https://discord.gg/gTMch6Gn2u',
    },
    {
      name: 'GitHub',
      icon: 'github',
      url: 'https://github.com/usevenice/venice',
    },
  ],
  tabs: [
    {
      name: 'API References',
      url: 'api',
    },
    {
      name: 'OpenAPI.json',
      url: 'https://raw.githubusercontent.com/useVenice/venice/main/packages/sdk/venice.oas.json',
    },
  ],
  navigation: [
    {
      group: 'Getting Started',
      pages: [
        'quickstart/quickstart',
        'quickstart/use-cases',
        'quickstart/features',
      ],
    },
    {
      group: 'Technical',
      pages: [
        'technical/data-models',
        'technical/architecture',
        'technical/apis',
        'technical/open-source',
        'technical/deploy-locally',
      ],
    },
    {
      group: 'Support',
      pages: [
        'support/faq',
        'support/custom-integration',
        'support/contact-us',
        'support/attribution',
      ],
    },
    {
      group: 'API Reference',
      pages: apiPages,
    },
  ],
  backgroundImage: '/images/background.png',
  footerSocials: {
    github: 'https://github.com/usevenice/venice',
    discord: 'https://discord.gg/gTMch6Gn2u',
    twitter: 'https://twitter.com/use_venice',
  },
  analytics: {
    posthog: {
      apiKey: 'phc_T3BM4neZzi3z2ruDiN0pYpGHIYjd5AjZw0rSkhzAKSo',
    },
  },
}

export interface MintConfig {
  name?: string
  openapi?: string
  logo?: {
    light?: string
    dark?: string
  }
  favicon?: string
  colors?: {
    primary?: string
    light?: string
    dark?: string
  }
  topbarLinks?: Array<{
    name?: string
    url?: string
  }>
  tabs?: Array<{
    name?: string
    url?: string
  }>
  topbarCtaButton?: {
    name?: string
    url?: string
  }
  anchors?: Array<{
    name?: string
    icon?: string
    url?: string
  }>

  navigation: NavigationGroup[]
  backgroundImage?: string
  footerSocials?: {
    github?: string
    discord?: string
    twitter?: string
  }
  analytics?: {
    posthog?: {
      apiKey?: string
    }
  }
  [key: string]: unknown
}

interface NavigationGroup {
  group: string
  pages: Array<string | NavigationGroup>
}

export default mintConfig

if (require.main === module) {
  const outPath = process.argv[2]
  if (outPath) {
    console.log(
      `[${new Date().toISOString()}] Writing mint config to ${outPath}`,
    )
    // eslint-disable-next-line unicorn/prefer-top-level-await
    void import('node:fs').then((fs) =>
      fs.writeFileSync(outPath, JSON.stringify(mintConfig, null, 2)),
    )
  } else {
    console.log(JSON.stringify(mintConfig))
  }
}
