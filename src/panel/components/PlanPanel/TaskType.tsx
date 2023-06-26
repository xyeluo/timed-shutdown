import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import { usePlanOptions } from '@panel/hooks'
import { RowItem } from '@/panel/components/common'
import { PanelSelect } from '@panel/components/common'
import { useTaskStore } from '@/panel/stores'

export default defineComponent({
  setup() {
    const options = usePlanOptions()
    const taskStore = useTaskStore()
    const extraCpt = (
      <span class={PPanelScss.extra}>呼出系统自带远程关机（局域网内）</span>
    )
    return () => (
      <RowItem
        class={PPanelScss.taskType}
        label="任务类型"
        v-slots={{ extra: extraCpt }}
      >
        <PanelSelect v-model:value={taskStore.task.plan} options={options} />
      </RowItem>
    )
  }
})
