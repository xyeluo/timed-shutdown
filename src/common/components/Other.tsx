import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import type { SelectOption } from 'naive-ui'
import {
  createVNode,
  type Component,
  type StyleValue,
  type VNodeChild
} from 'vue'
import type { Plan } from '@cmn/types'

export const PanelSelect = defineComponent({
  props: {
    value: String,
    options: Object as PropType<SelectOption[]>,
    onUpdateValue: Object as PropType<Function>
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    return () => (
      <n-select
        v-model:value={ref(props.value).value}
        onUpdateValue={(value: string) =>
          props.onUpdateValue
            ? props.onUpdateValue(value)
            : emit('update:value', value)
        }
        size="small"
        style={{ width: '90px' }}
        options={props.options}
        placeholder="请选择"
      />
    )
  }
})

export const RowItem = defineComponent({
  props: {
    label: Object as PropType<String | (() => VNodeChild)>,
    labelStyle: Object as PropType<StyleValue>,
    style: Object as PropType<StyleValue>
  },
  setup(props, { slots }) {
    return () => (
      <div class={PPanelScss.item} style={props.style}>
        <label class={PPanelScss.itemLabel} style={props.labelStyle}>
          {typeof props.label === 'string'
            ? props.label
            : (props.label as Function)?.()}
        </label>
        <div class={PPanelScss.itemContent}>{slots.default?.()}</div>
        {slots.extra?.()}
      </div>
    )
  }
})

let cache = new Map<String, Component>()
export const SwitchComponet = defineComponent({
  props: {
    is: {
      type: Object as PropType<Component>,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return () => {
      // 缓存组件
      let component = cache.get(props.id)
      if (!component) {
        component = createVNode(props.is)
        cache.set(props.id, component)
      }
      return component
    }
  }
})

export const rowProps = {
  row: {
    type: Object as PropType<Plan>,
    default: {}
  }
}
