import { Page } from '@cmn/components/Page'
import Notice from '@notice/components/Notice'
import '@cmn/styles/index.scss'

export default defineComponent({
  setup() {
    return () => (
      <Page bodyColor="transparent">
        <Notice />
      </Page>
    )
  }
})
