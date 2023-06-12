import { RowItem } from '@/panel/components/common'

export default defineComponent({
  props: { value: String },
  emits: ['update:value'],
  setup(props, { emit }) {
    let name = props.value
    const noSideSpace = (value: string) =>
      !value.startsWith(' ') && !value.endsWith(' ')

    return () => (
      <RowItem label="任务类型">
        <n-input
          size="small"
          v-model:value={name}
          placeholder="选填，可自动生成"
          allow-input={noSideSpace}
          onUpdateValue={(value: string) => emit('update:value', value)}
        />
      </RowItem>
    )
  }
})
