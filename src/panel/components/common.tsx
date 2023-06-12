import PPanelScss from '@panel/styles/PlanPanel.module.scss'
import type { SelectOption } from 'naive-ui'
import { createVNode, type Component, type PropType } from 'vue'

export const PanelSelect = defineComponent({
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

export const RowItem = defineComponent({
  props: {
    label: String
  },
  setup(props, { slots }) {
    const cpt = computed(() => slots.default?.())
    return () => (
      <div class={PPanelScss.item}>
        <label class={PPanelScss.itemLabel}>{props.label}</label>
        <div class={PPanelScss.itemContent}>{cpt.value}</div>
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
