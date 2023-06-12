import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import { useTypeOptions } from '@panel/hooks'
import { RowItem } from '@/panel/components/common'
import { PanelSelect } from '@panel/components/common'

export default defineComponent({
  props: { value: String },
  emits: ['update:value'],
  setup(props, { emit }) {
    const options = useTypeOptions()
    let type = ref(options[0].value)
    type.value = props.value !== '' ? props.value : type.value
    watch(type, (nValue) => emit('update:value', nValue))

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
