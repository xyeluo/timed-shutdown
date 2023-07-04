import { Page } from '@cmn/Page'
import Notice from '@notice/Notice'
import '@cmn/styles/index.scss'

export default defineComponent({
  setup() {
    return () => (
      <Page bodyColor="transparent">
        <Notice></Notice>
      </Page>
    )
  }
})
