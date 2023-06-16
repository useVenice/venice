// @deprecated. Soon to be fully replaced by integrations.merge.ts

import {mergedIntegrations} from './integrations/integrations.merged'

export const PROVIDERS = [...Object.values(mergedIntegrations)] as const
