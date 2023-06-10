import type { SelectOption } from 'naive-ui'
import { type PropType } from 'vue'

export const PanelSelect = defineComponent({
  props: {
    value: String,
    options: Object as PropType<SelectOption[]>
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    let select = props.value
    return () => (
      <n-select
        v-model:value={select}
        onUpdateValue={(value: string) => emit('update:value', value)}
        size="small"
        style={{ width: '90px' }}
        options={props.options}
        placeholder="请选择"
      />
    )
  }
})
