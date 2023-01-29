import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../layouts/PageLayout'

export default function ExportPage() {
  return (
    <PageLayout title="Export Data">
      <PageHeader title={['Export Data', 'CSV']} />
    </PageLayout>
  )
}
