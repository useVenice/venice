import {RedirectTo} from '../components/common-components'
import {PageLayout} from '../components/PageLayout'

export default function Page() {
  return (
    <PageLayout title="Home">
      <RedirectTo url="/connections" />
    </PageLayout>
  )
}
