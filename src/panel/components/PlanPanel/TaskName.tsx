import { RowItem } from '@/panel/components/common'
import { useTaskStore } from '@cmn/stores'

export default defineComponent({
  setup() {
    const taskStore = useTaskStore()
    const noSideSpace = (value: string) =>
      !value.startsWith(' ') && !value.endsWith(' ')
    return () => (
      <RowItem label="任务名称">
        <n-input
          size="small"
          v-model:value={taskStore.task.name}
          placeholder="选填，可自动生成"
          allow-input={noSideSpace}
          clearable
        />
      </RowItem>
    )
  }
})
