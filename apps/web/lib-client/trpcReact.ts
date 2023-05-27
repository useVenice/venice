import type {TRPCReact} from '@usevenice/engine-frontend'
import {_trpcReact} from '@usevenice/engine-frontend'

import type {AppRouter} from '../lib-server/appRouter'

/** Move this somewhere where other components can access */
export const trpcReact = _trpcReact as unknown as TRPCReact<AppRouter>
