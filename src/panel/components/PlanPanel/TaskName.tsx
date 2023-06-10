import { RowItem } from '@panel/components/RowItem'

export const TaskName = defineComponent({
  setup() {
    let name = ref('')
    watch(name, (nValue) => {
      // console.log(`'${name.value}'`)
    })
    const noSideSpace = (value: string) =>
      !value.startsWith(' ') && !value.endsWith(' ')

    return () => (
      <RowItem label="任务类型">
        <n-input
          size="small"
          v-model:value={name.value}
          placeholder="选填，可自动生成"
          allow-input={noSideSpace}
        />
      </RowItem>
    )
  }
})
