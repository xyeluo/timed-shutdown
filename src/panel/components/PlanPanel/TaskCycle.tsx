import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import {
  useCycleOptions,
  type Cycle,
  useCycleWeeklyOptions
} from '@panel/hooks'
import { RowItem } from '@panel/components/RowItem'
import { PanelSelect } from '@panel/components/PlanPanel/PanelSelect'

const Weekly = defineComponent({
  setup() {
    const options = useCycleWeeklyOptions()

    let weekly = ref(options[0].value)
    return () => (
      <n-select
        v-model:value={weekly.value}
        multiple
        options={options}
        size="small"
        style={{ minWidth: '100px', maxWidth: '360px' }}
      />
    )
  }
})

const Monthly = defineComponent({
  setup() {
    return () => (
      <n-checkbox-group size="small" style={{ width: '400px' }}>
        <n-space size="small">
          {[
            Array.from({ length: 31 }).map((_, i) => {
              const index = i + 1
              return (
                <n-checkbox value={index} key={index}>
                  {index}
                </n-checkbox>
              )
            })
          ]}
        </n-space>
      </n-checkbox-group>
    )
  }
})
export default defineComponent({
  setup() {
    const options = useCycleOptions()
    let type = ref<Cycle>(options[0].value)

    watch(type, (nValue) => {
      console.log(cycleCpt[type.value])
    })

    const cycleCpt = {
      once: (
        <n-date-picker
          type="date"
          size="small"
          placeholder="具体日期"
          is-date-disabled={(ts: number) => ts < Date.now() - 24 * 3600 * 1000}
        />
      ),
      daily: '',
      weekly: h(Weekly),
      monthly: h(Monthly)
    }

    const extraCpt = (
      <n-switch class={PPanelScss.extra}>
        {{
          checked: () => '执行后删除',
          unchecked: () => '执行后保留'
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
        <RowItem label={type.value === 'monthly' ? '日期' : ''}>
          {cycleCpt[type.value]}
        </RowItem>
        <RowItem>
          <n-time-picker size="small" placeholder="执行时间" />
        </RowItem>
      </>
    )
  }
})
