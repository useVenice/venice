import {RedirectTo} from '../../components/RedirectTo'
import {PageLayout} from '../../components/PageLayout'

export default function Page() {
  return (
    <PageLayout title="Home" auth="user">
      <RedirectTo url="/admin/connections" />
    </PageLayout>
  )
}
