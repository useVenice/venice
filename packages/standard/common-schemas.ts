import {zCast} from '@usevenice/util'

type MergeSchemas =
  import('../../integrations/integration-merge/merge.accounting.gen').components['schemas']

export const Invoice = zCast<MergeSchemas['Invoice']>()
