import type {UserId} from '@usevenice/cdk-core'
import {VeniceProvider} from '@usevenice/engine-frontend'
import {fromMaybeArray} from '@usevenice/util'
import {useRouter} from 'next/router'
import {PageHeader} from '../../components/PageHeader'
import {PageLayout} from '../../components/PageLayout'
import {PipelinesTable} from '../../components/PipelinesTable'

export default function PipelinesPage() {
  const router = useRouter()
  const viewAsUserId = fromMaybeArray(router.query['viewAsUserId'])[0] as UserId
  const {trpc} = VeniceProvider.useContext()
  const pipelines = trpc.listPipelines.useQuery({viewAsUserId})

  return (
    <PageLayout title="Pipelines" auth="admin">
      <div className="">
        <PageHeader title={['Pipelines', viewAsUserId]} />
        {pipelines.isLoading ? (
          <span>Loading...</span>
        ) : (
          <PipelinesTable pipelines={pipelines.data ?? []} />
        )}
      </div>
    </PageLayout>
  )
}
