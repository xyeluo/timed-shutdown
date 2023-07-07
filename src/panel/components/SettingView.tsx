import { changeTheme, getCurrentTheme, type themeType } from '@cmn/Page'
import { PanelSelect, RowItem } from './common'

export default defineComponent({
  props: {
    active: Boolean
  },
  emits: ['update:active'],
  setup(props, { emit }) {
    let selectedTheme = ref<themeType>(getCurrentTheme())
    const themesData = [
      { label: '自动', value: 'auto' },
      { label: '明亮', value: 'light' },
      { label: '暗黑', value: 'dark' }
    ]

    watch(selectedTheme, () => changeTheme(selectedTheme.value), {
      immediate: true
    })

    return () => (
      <n-drawer
        v-model:show={props.active}
        width="300"
        on-update:show={(nValue: boolean) => emit('update:active', nValue)}
      >
        <n-drawer-content closable>
          {{
            header: () => <div>设置</div>,
            default: () => (
              <RowItem
                label="主题："
                style={{ textAlign: 'left', width: 'auto' }}
              >
                <PanelSelect
                  options={themesData}
                  v-model:value={selectedTheme.value}
                ></PanelSelect>
              </RowItem>
            )
          }}
        </n-drawer-content>
      </n-drawer>
    )
  }
})
