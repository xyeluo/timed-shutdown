import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import { RowItem } from '@panel/components/common'
import { useTaskStore } from '@/panel/stores'

let modalState = ref(true)
export const showModal = () => {
  modalState.value = !modalState.value
}

const Action = defineComponent({
  setup() {
    const { createTask } = useTaskStore()
    let loading = ref(false)
    return () => (
      <RowItem>
        <n-space>
          <n-button
            loading={loading.value}
            type="info"
            color="#409eff"
            onClick={() => {
              createTask(loading)
            }}
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
    let plan = ref({
      type: '',
      name: '',
      cycle: ''
    })

    watch(
      plan,
      (nValue) => {
        console.log(nValue)
      },
      {
        deep: true
      }
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
          <TaskType v-model:value={plan.value.type} />
          <TaskName v-model:value={plan.value.name} />
          <TaskCycle />
        </div>
        <Action />
      </n-modal>
    )
  }
})
