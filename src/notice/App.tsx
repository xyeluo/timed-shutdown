import { Page } from '@/common/Page'
import Notice from '@notice/Notice'

export default defineComponent({
  setup() {
    return () => (
      <Page bodyColor="transparent">
        <Notice></Notice>
      </Page>
    )
  }
})
