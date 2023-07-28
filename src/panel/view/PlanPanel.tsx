import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import { RowItem } from '@cmn/components/Other'
import { useTaskStore } from '@panel/stores'
import { useErrorMsg, useSuccessMsg, useTaskInvalid } from '@cmn/hooks'

let modalState = ref(false)
export const showModal = () => {
  modalState.value = !modalState.value
}

const Confirm = defineComponent({
  setup() {
    let loading = ref(false)
    const taskStore = useTaskStore()

    const createTask = async () => {
      if (useTaskInvalid(taskStore.task)) return
      loading.value = !loading.value
      taskStore
        .createTask()
        .then((stdout) => {
          useSuccessMsg(stdout)
        })
        .catch((error) => {
          const e = error?.stack || error
          useErrorMsg(e)
        })
        .finally(() => {
          loading.value = !loading.value
        })
    }
    return () => (
      <RowItem>
        <n-space>
          <n-button
            loading={loading.value}
            type="info"
            onClick={createTask}
            disabled={loading.value}
          >
            确定
          </n-button>
          <n-button onClick={showModal}>取消</n-button>
        </n-space>
      </RowItem>
    )
  }
})

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
          'max-width': '520px',
          top: '-78px'
        }}
        to="#app"
        closable={false}
        display-directive="show"
        auto-focus={false}
      >
        <div class={PPanelScss.container}>
          <TaskType />
          <TaskName />
          <TaskCycle />
        </div>
        <Confirm />
      </n-modal>
    )
  }
})
