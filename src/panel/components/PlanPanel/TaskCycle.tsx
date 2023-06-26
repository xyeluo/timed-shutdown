import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import { useCycleOptions, useCycleWeeklyOptions } from '@panel/hooks'
import { RowItem, SwitchComponet } from '@/panel/components/common'
import { PanelSelect } from '@panel/components/common'
import { useTaskStore } from '@/panel/stores'
import { storeToRefs } from 'pinia'

const dateTimeCommonAttr = {
  size: 'small',
  'input-readonly': true,
  clearable: true
}

const Once = defineComponent({
  setup() {
    const { task } = storeToRefs(useTaskStore())
    return () => (
      <n-date-picker
        type="date"
        {...dateTimeCommonAttr}
        placeholder="具体日期"
        v-model:formatted-value={task.value.cycle.date}
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
    const { task } = storeToRefs(useTaskStore())
    return () => (
      <n-checkbox-group
        size={dateTimeCommonAttr.size}
        style={{ width: '400px' }}
        v-model:value={task.value.cycle.otherDate}
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
    const { task } = storeToRefs(useTaskStore())
    return () => (
      <n-checkbox-group
        size={dateTimeCommonAttr.size}
        style={{ width: '400px' }}
        v-model:value={task.value.cycle.otherDate}
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
    const { task } = storeToRefs(useTaskStore())
    const cycleCpt = {
      once: Once,
      daily: '',
      weekly: Weekly,
      monthly: Monthly
    }

    const switchCycleCpt = () => {
      if (task.value.cycle.type === 'daily') {
        return null
      }
      return (
        <RowItem label={task.value.cycle.type === 'monthly' ? '日期' : ''}>
          <SwitchComponet
            is={cycleCpt[task.value.cycle.type]}
            id={task.value.cycle.type}
          ></SwitchComponet>
        </RowItem>
      )
    }

    const extraCpt = (
      <n-switch
        class={PPanelScss.extra}
        v-model:value={task.value.cycle.autoDelete}
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
          v-slots={{ extra: task.value.cycle.type === 'once' ? extraCpt : '' }}
        >
          <PanelSelect
            v-model:value={task.value.cycle.type}
            options={options}
          />
        </RowItem>
        {/* 动态渲染组件 */}
        {switchCycleCpt()}
        <RowItem>
          <n-time-picker
            {...dateTimeCommonAttr}
            v-model:formatted-value={task.value.cycle.time}
            placeholder="执行时间"
            format="HH:mm"
          />
        </RowItem>
      </>
    )
  }
})
