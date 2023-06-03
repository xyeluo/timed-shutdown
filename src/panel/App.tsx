import { Page, type PageInstance } from '@panel/components/Page';
const PlanPanel = defineAsyncComponent(() => import("@panel/views/PlanPanel"))
const PlanList = defineAsyncComponent(() => import("@panel/views/PlanList"))

export default defineComponent({
  props: {},
  setup() {

    const page = ref<PageInstance>()
    return () => (
      <Page ref={page}>
        <header></header>
        <main>
          <PlanPanel />
          <PlanList />
        </main>
        <footer></footer>
      </Page>
    )
  }
})