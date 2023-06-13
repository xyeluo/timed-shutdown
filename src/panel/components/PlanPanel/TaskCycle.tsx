import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import {
  useCycleOptions,
  type CycleType,
  useCycleWeeklyOptions
} from '@panel/hooks'
import { RowItem, SwitchComponet } from '@/panel/components/common'
import { PanelSelect } from '@panel/components/common'
import { taskStore } from '@panel/store'

const dateTimeCommonAttr = {
  size: 'small',
  'input-readonly': true,
  clearable: true
}

const Once = defineComponent({
  setup() {
    return () => (
      <n-date-picker
        type="date"
        {...dateTimeCommonAttr}
        placeholder="具体日期"
        v-model:formatted-value={taskStore.cycle.date}
        is-date-disabled={(ts: number) => ts < Date.now() - 24 * 3600 * 1000}
        style={{ width: '140px' }}
        value-format="yyyy-MM-dd"
      />
    )
  }
})

const Weekly = defineComponent({
  setup() {
    const options = useCycleWeeklyOptions()

    return () => (
      <n-select
        v-model:value={taskStore.cycle.date}
        multiple
        options={options}
        size={dateTimeCommonAttr.size}
        style={{ minWidth: '100px', maxWidth: '360px' }}
      />
    )
  }
})

const Monthly = defineComponent({
  setup() {
    return () => (
      <n-checkbox-group
        size={dateTimeCommonAttr.size}
        style={{ width: '400px' }}
        v-model:value={taskStore.cycle.date}
      >
        <div class={PPanelScss.dateGrid}>
          {[
            Array.from({ length: 31 }).map((_, i) => {
              const index = i + 1
              return (
                <n-checkbox
                  size={dateTimeCommonAttr.size}
                  value={index}
                  key={index}
                >
                  {index}
                </n-checkbox>
              )
            })
          ]}
        </div>
      </n-checkbox-group>
    )
  }
})

export default defineComponent({
  setup() {
    const options = useCycleOptions()

    const cycleCpt = {
      once: Once,
      daily: '',
      weekly: Weekly,
      monthly: Monthly
    }

    let switchCycleCpt = computed(() => {
      if (taskStore.cycle.type === 'daily') {
        return null
      }
      return (
        <RowItem label={taskStore.cycle.type === 'monthly' ? '日期' : ''}>
          <SwitchComponet
            is={cycleCpt[taskStore.cycle.type]}
            id={taskStore.cycle.type}
          ></SwitchComponet>
        </RowItem>
      )
    })

    // 当任务周期发生改变时清除date
    watch(
      () => taskStore.cycle.type,
      (nValue) => {
        taskStore.cycle.date = null
      }
    )

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
          v-slots={{ extra: taskStore.cycle.type === 'once' ? extraCpt : '' }}
        >
          <PanelSelect v-model:value={taskStore.cycle.type} options={options} />
        </RowItem>
        {/* 动态渲染组件 */}
        {switchCycleCpt.value}
        <RowItem>
          <n-time-picker
            {...dateTimeCommonAttr}
            v-model:formatted-value={taskStore.cycle.time}
            placeholder="执行时间"
            format="HH:mm"
          />
        </RowItem>
      </>
    )
  }
})
