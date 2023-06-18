import { RowItem } from '@/panel/components/common'
import { useTaskStore } from '@/panel/stores'

export default defineComponent({
  setup() {
    const { task } = useTaskStore()
    const noSideSpace = (value: string) =>
      !value.startsWith(' ') && !value.endsWith(' ')
    return () => (
      <RowItem label="任务名称">
        <n-input
          size="small"
          v-model:value={task.name}
          placeholder="选填，可自动生成"
          allow-input={noSideSpace}
        />
      </RowItem>
    )
  }
})
