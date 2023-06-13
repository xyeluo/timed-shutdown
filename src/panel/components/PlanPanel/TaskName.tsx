import { RowItem } from '@/panel/components/common'
import { taskStore } from '@panel/store'

export default defineComponent({
  setup() {
    const noSideSpace = (value: string) =>
      !value.startsWith(' ') && !value.endsWith(' ')
    return () => (
      <RowItem label="任务类型">
        <n-input
          size="small"
          v-model:value={taskStore.name}
          placeholder="选填，可自动生成"
          allow-input={noSideSpace}
        />
      </RowItem>
    )
  }
})
