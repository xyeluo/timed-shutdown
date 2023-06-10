import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import { useCycleOptions, type Cycle } from '@panel/hooks'
import { RowItem } from '@panel/components/RowItem'
import { PanelSelect } from '@panel/components/PlanPanel/PanelSelect'

export const TaskCycle = defineComponent({
  setup() {
    const options = useCycleOptions()
    let type = ref<Cycle>(options[0].value)

    watch(type, (nValue) => {
      console.log(nValue)
    })

    const cycleCpt = {
      once: (
        <RowItem>
          <n-date-picker
            type="date"
            size="small"
            placeholder="具体日期"
            is-date-disabled={(ts: number) =>
              ts < Date.now() - 24 * 3600 * 1000
            }
          />
        </RowItem>
      ),
      daily: '',
      weekly: () => {},
      monthly: () => {}
    }
    const extraCpt = (
      <n-switch size="small" class={PPanelScss.extra}>
        {{
          checked: () => '自动删除过期任务',
          unchecked: () => '自动删除过期任务'
        }}
      </n-switch>
    )

    return () => (
      <>
        <RowItem
          label="任务周期"
          class={PPanelScss.taskCycle}
          v-slots={{ extra: extraCpt }}
        >
          <PanelSelect v-model:value={type.value} options={options} />
        </RowItem>
        {/* 动态渲染组件 */}
        {cycleCpt[type.value]}
        <RowItem>
          <n-time-picker size="small" placeholder="执行时间" />
        </RowItem>
      </>
    )
  }
})
