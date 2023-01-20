import {PageContainer, RedirectTo} from '../components/common-components'

export default function HomeScreen() {
  return (
    <PageContainer>
      <RedirectTo url="/pipelines" />
    </PageContainer>
  )
}
