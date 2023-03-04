import './register.node'

import {fsProvider} from '@usevenice/core-integration-fs'
import {sync} from '@usevenice/cdk-core'

sync({
  source: fsProvider.sourceSync({
    id: 'reso_1',
    settings: {
      basePath:
        '/Users/tony/Code/usevenice/venice/apps/tests/__encrypted__/meta',
    },
    state: {},
  }),
  destination: fsProvider.destinationSync({
    id: 'reso_1',
    settings: {
      basePath: '/Users/tony/Code/usevenice/venice/apps/app-config/sample',
    },
  }),
}).catch(console.error)
