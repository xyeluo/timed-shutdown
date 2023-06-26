import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import { useCycleOptions, useCycleWeeklyOptions } from '@panel/hooks'
import { RowItem, SwitchComponet } from '@/panel/components/common'
import { PanelSelect } from '@panel/components/common'
import { useTaskStore } from '@/panel/stores'

const dateTimeCommonAttr = {
  size: 'small',
  'input-readonly': true,
  clearable: true
}

const Once = defineComponent({
  setup() {
    const taskStore = useTaskStore()
    return () => (
      <n-date-picker
        type="date"
        {...dateTimeCommonAttr}
        placeholder="具体日期"
        v-model:formatted-value={taskStore.task.cycle.date}
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
    const taskStore = useTaskStore()
    return () => (
      <n-checkbox-group
        size={dateTimeCommonAttr.size}
        style={{ width: '400px' }}
        v-model:value={taskStore.task.cycle.otherDate}
      >
        <div class={PPanelScss.weeklyGrid}>
          {options.map((o) => {
            return (
              <n-checkbox
                size={dateTimeCommonAttr.size}
                key={o.value}
                value={`${o.value}`}
              >
                {o.label}
              </n-checkbox>
            )
          })}
        </div>
      </n-checkbox-group>
    )
  }
})

const Monthly = defineComponent({
  setup() {
    const taskStore = useTaskStore()
    return () => (
      <n-checkbox-group
        size={dateTimeCommonAttr.size}
        style={{ width: '400px' }}
        v-model:value={taskStore.task.cycle.otherDate}
      >
        <div class={PPanelScss.monthlyGrid}>
          {Array.from({ length: 31 }).map((_, i) => {
            const index = i + 1
            return (
              <n-checkbox
                size={dateTimeCommonAttr.size}
                value={`${index}`}
                key={index}
              >
                {index}
              </n-checkbox>
            )
          })}
        </div>
      </n-checkbox-group>
    )
  }
})

export default defineComponent({
  setup() {
    const options = useCycleOptions()
    const taskStore = useTaskStore()
    const cycleCpt = {
      once: Once,
      daily: '',
      weekly: Weekly,
      monthly: Monthly
    }

    const switchCycleCpt = () => {
      if (taskStore.task.cycle.type === 'daily') {
        return null
      }
      return (
        <RowItem label={taskStore.task.cycle.type === 'monthly' ? '日期' : ''}>
          <SwitchComponet
            is={cycleCpt[taskStore.task.cycle.type]}
            id={taskStore.task.cycle.type}
          ></SwitchComponet>
        </RowItem>
      )
    }

    const extraCpt = (
      <n-switch
        class={PPanelScss.extra}
        v-model:value={taskStore.task.cycle.autoDelete}
      >
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
          v-slots={{
            extra: taskStore.task.cycle.type === 'once' ? extraCpt : ''
          }}
        >
          <PanelSelect
            v-model:value={taskStore.task.cycle.type}
            options={options}
          />
        </RowItem>
        {/* 动态渲染组件 */}
        {switchCycleCpt()}
        <RowItem>
          <n-time-picker
            {...dateTimeCommonAttr}
            v-model:formatted-value={taskStore.task.cycle.time}
            placeholder="执行时间"
            format="HH:mm"
          />
        </RowItem>
      </>
    )
  }
})
