import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import { useTypeOptions } from '@panel/hooks'
import { RowItem } from '@panel/components/RowItem'
import { PanelSelect } from '@panel/components/PlanPanel/PanelSelect'

export default defineComponent({
  setup() {
    const options = useTypeOptions()
    let type = ref(options[0].value)
    watch(type, (nValue) => {
      console.log(nValue)
    })

    const extraCpt = (
      <span class={PPanelScss.extra}>呼出系统自带远程关机（局域网内）</span>
    )
    return () => (
      <RowItem
        class={PPanelScss.taskType}
        label="任务类型"
        v-slots={{ extra: extraCpt }}
      >
        <PanelSelect v-model:value={type.value} options={options} />
      </RowItem>
    )
  }
})
