import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import { TaskType } from '../components/PlanPanel/TaskType'
import { TaskName } from '../components/PlanPanel/TaskName'
import { TaskCycle } from '../components/PlanPanel/TaskCycle'

let modalState = ref(true)
export const showModal = () => {
  modalState.value = !modalState.value
}

export default defineComponent({
  name: 'PlanPanel',
  setup() {
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
      </n-modal>
    )
  }
})
