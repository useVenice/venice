import {PageContainer, RedirectTo} from '../components/common-components'

export default function HomeScreen() {
  return (
    <PageContainer authenticated>
      <RedirectTo url="/profile" />
    </PageContainer>
  )
}
