import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import {
  useCycleOptions,
  type CycleType,
  useCycleWeeklyOptions
} from '@panel/hooks'
import { RowItem, SwitchComponet } from '@/panel/components/common'
import { PanelSelect } from '@panel/components/common'
import type { Component } from 'vue'

const Once = defineComponent({
  setup() {
    return () => (
      <n-date-picker
        type="date"
        size="small"
        placeholder="具体日期"
        is-date-disabled={(ts: number) => ts < Date.now() - 24 * 3600 * 1000}
      />
    )
  }
})

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
  props: { value: String },
  emits: ['update:value'],
  setup(props, { emit }) {
    interface Cycle {
      type: CycleType
    }
    const options = useCycleOptions()
    let cycle = ref<Cycle>({
      type: options[0].value
    })

    const cycleCpt = {
      once: Once,
      daily: '',
      weekly: Weekly,
      monthly: Monthly
    }

    let switchCycleCpt = computed(() => {
      if (cycle.value.type === 'daily') {
        return null
      }
      return (
        <RowItem label={cycle.value.type === 'monthly' ? '日期' : ''}>
          <SwitchComponet
            is={cycleCpt[cycle.value.type]}
            id={cycle.value.type}
          ></SwitchComponet>
        </RowItem>
      )
    })

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
          v-slots={{ extra: cycle.value.type === 'once' ? extraCpt : '' }}
        >
          <PanelSelect v-model:value={cycle.value.type} options={options} />
        </RowItem>
        {/* 动态渲染组件 */}
        {switchCycleCpt.value}
        <RowItem>
          <n-time-picker size="small" placeholder="执行时间" />
        </RowItem>
      </>
    )
  }
})
