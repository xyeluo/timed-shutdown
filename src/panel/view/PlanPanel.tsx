import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import { RowItem } from '@panel/components/RowItem'

const Action = defineComponent({
  setup() {
    return () => (
      <RowItem>
        <n-space>
          <n-button size="medium" type="info" color="#409eff">
            确定
          </n-button>
          <n-button onClick={showModal}>取消</n-button>
        </n-space>
      </RowItem>
    )
  }
})

let modalState = ref(true)
export const showModal = () => {
  modalState.value = !modalState.value
}

export default defineComponent({
  name: 'PlanPanel',
  setup() {
    const TaskType = defineAsyncComponent(
      () => import('@panel/components/PlanPanel/TaskType')
    )
    const TaskCycle = defineAsyncComponent(
      () => import('@panel/components/PlanPanel/TaskCycle')
    )
    const TaskName = defineAsyncComponent(
      () => import('@panel/components/PlanPanel/TaskName')
    )
    return () => (
      <n-modal
        v-model:show={modalState.value}
        transform-origin="center"
        size="small"
        preset="card"
        style={{
          'min-width': '450px',
          'max-width': '520px'
        }}
        to="#app"
        closable={false}
        auto-focus={false}
      >
        <div class={PPanelScss.container}>
          <TaskType />
          <TaskName />
          <TaskCycle />
        </div>
        <Action />
      </n-modal>
    )
  }
})
