import PPanelScss from '@panel/styles/PlanPanel.module.scss'

export const RowItem = defineComponent({
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