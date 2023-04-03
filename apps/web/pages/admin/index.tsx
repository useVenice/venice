import {RedirectTo} from '../../components/RedirectTo'
import {AdminPageLayout} from '../../components/PageLayout'

export default function Page() {
  return (
    <AdminPageLayout title="Home">
      <RedirectTo url="/admin/integrations" />
    </AdminPageLayout>
  )
}
