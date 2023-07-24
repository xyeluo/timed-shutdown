import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import { useCycleOptions, useCycleWeeklyOptions } from '@cmn/hooks'
import { RowItem, SwitchComponet } from '@panel/components/common'
import { PanelSelect } from '@panel/components/common'
import { useTaskStore } from '@panel/stores'

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
      const label = {
        monthly: '日期',
        weekly: '星期'
      }
      return (
        <RowItem
          label={label[taskStore.task.cycle.type as keyof typeof label] ?? ''}
        >
          <SwitchComponet
            is={cycleCpt[taskStore.task.cycle.type]}
            id={taskStore.task.cycle.type}
          ></SwitchComponet>
        </RowItem>
      )
    }

    const extraCpt = {
      once: (
        <n-switch
          class={PPanelScss.extra}
          default-value={taskStore.task.cycle.autoDelete}
          onUpdateValue={(value: boolean) => {
            taskStore.task.cycle.autoDelete = value
          }}
        >
          {{
            checked: () => '执行后删除',
            unchecked: () => '执行后保留'
          }}
        </n-switch>
      ),
      monthly: (
        <n-popover trigger="hover">
          {{
            default: () => '例：9月没有31日，当天的任务将顺延到下个月31日执行',
            trigger: () => (
              <n-alert
                class={PPanelScss.extra}
                type="info"
                themeOverrides={{
                  padding: '3px 18px',
                  iconMargin: '5px 8px 0 12px',
                  colorInfo: '#f4f4f5',
                  contentTextColorInfo: '#909399',
                  iconColorInfo: '#909399'
                }}
                bordered={false}
              >
                当月没有的日期任务将会顺延到下个月
              </n-alert>
            )
          }}
        </n-popover>
      )
    }
    return () => (
      <>
        <RowItem
          label="任务周期"
          class={PPanelScss.taskCycle}
          v-slots={{
            extra:
              extraCpt[taskStore.task.cycle.type as keyof typeof extraCpt] ?? ''
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
