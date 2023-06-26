import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import { usePlanOptions } from '@panel/hooks'
import { RowItem } from '@/panel/components/common'
import { PanelSelect } from '@panel/components/common'
import { useTaskStore } from '@/panel/stores'
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const options = usePlanOptions()
    const { task } = storeToRefs(useTaskStore())
    const extraCpt = (
      <span class={PPanelScss.extra}>呼出系统自带远程关机（局域网内）</span>
    )
    return () => (
      <RowItem
        class={PPanelScss.taskType}
        label="任务类型"
        v-slots={{ extra: extraCpt }}
      >
        <PanelSelect v-model:value={task.value.plan} options={options} />
      </RowItem>
    )
  }
})
