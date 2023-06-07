import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import type { SelectOption } from 'naive-ui'
import type { PropType } from 'vue'

const RowItem = defineComponent({
  props: {
    label: String
  },
  setup(props, { slots }) {
    return () => (
      <div class={PPanelScss.item}>
        <label class={PPanelScss.itemLabel}>{props.label}</label>
        <div class={PPanelScss.itemContent}>{slots.default?.()}</div>
        {slots.extra?.()}
      </div>
    )
  }
})

const PanelSelect = defineComponent({
  props: {
    value: String,
    options: Object as PropType<SelectOption[]>
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    let select = props.value
    return () => (
      <n-select
        v-model:value={select}
        onUpdateValue={(value: string) => emit('update:value', value)}
        size="small"
        style={{ width: '90px' }}
        options={props.options}
        placeholder="请选择"
      />
    )
  }
})

const TaskType = defineComponent({
  setup() {
    const options: SelectOption[] = [
      {
        label: '关机',
        value: 'shutdown'
      },
      {
        label: '重启',
        value: 'reboot'
      },
      {
        label: '休眠',
        value: 'dormancy'
      }
    ]
    let type = ref(options[0].value)
    watch(type, (nValue) => {
      console.log(nValue)
    })

    const extraCpt = () => (
      <span class={PPanelScss.extra}>呼出系统自带远程关机（局域网内）</span>
    )
    return () => (
      <RowItem
        class={PPanelScss.taskType}
        label="任务类型"
        v-slots={{ extra: extraCpt }}
      >
        <PanelSelect v-model:value={type.value} options={options} />
      </RowItem>
    )
  }
})

const TaskName = defineComponent({
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

const TaskCycle = defineComponent({
  setup() {
    enum cycle {
      once = 'once',
      daily = 'daily',
      weekly = 'weekly',
      monthly = 'monthly'
    }

    const options: SelectOption[] = [
      {
        label: '仅一次',
        value: cycle.once
      },
      {
        label: '每天',
        value: 'daily'
      },
      {
        label: '每周',
        value: 'weekly'
      },
      {
        label: '每月',
        value: 'monthly'
      }
    ]
    let type = ref<string>(options[0].value as string)

    watch(type, (nValue) => {
      console.log(nValue)
    })

    const cycleCpt = {
      once: () => {},
      daily: () => {},
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
          v-solts={{ extra: extraCpt }}
        >
          <PanelSelect v-model:value={type.value} options={options} />
        </RowItem>
        <RowItem></RowItem>
      </>
    )
  }
})

let modalState = ref(true)
export const showModal = () => {
  modalState.value = !modalState.value
}
export default defineComponent({
  name: 'PlanPanel',
  setup() {
    return () => (
      <n-modal
        v-model:show={modalState.value}
        transform-origin="center"
        size="small"
        preset="card"
        style={{
          'min-width': '450px',
          'max-width': '520px'
        }}
        to="#app"
        closable={false}
        auto-focus={false}
      >
        <div class={PPanelScss.container}>
          <TaskType />
          <TaskName />
          <TaskCycle />
        </div>
      </n-modal>
    )
  }
})
