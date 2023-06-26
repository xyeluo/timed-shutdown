import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import { RowItem } from '@panel/components/common'
import { usePlansStore, useTaskStore } from '@/panel/stores'
import { useErrorMsg, useOtherDate, useSuccessMsg } from '@panel/hooks'
import type { Task } from '@/common/types'

let modalState = ref(false)
export const showModal = () => {
  modalState.value = !modalState.value
}

const Action = defineComponent({
  setup() {
    let loading = ref(false)
    const taskStore = useTaskStore()
    const { addPlan } = usePlansStore()
    // let temp: Task = {
    //   name: 'test1',
    //   plan: 'shutdown',
    //   cycle: {
    //     type: 'weekly',
    //     date: '2023-06-26',
    //     time: '01:00',
    //     otherDate: [ 'sunday', 'monday', 'friday' ],
    //     autoDelete: true
    //   }
    // }
    // addPlan(temp)

    // todo: 数据验证，封装loading
    const createTask = () => {
      loading.value = !loading.value
      useOtherDate(taskStore.task)
      taskStore
        .createTask()
        .then((stdout) => {
          useSuccessMsg(stdout)
          addPlan(taskStore.task)
          taskStore.$reset()
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
            color="#409eff"
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
