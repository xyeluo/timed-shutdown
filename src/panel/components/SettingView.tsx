import { changeTheme, getCurrentTheme, type themeType } from '@cmn/Page'
import { RowItem } from './common'

export default defineComponent({
  props: {
    active: Boolean
  },
  emits: ['update:active'],
  setup(props, { emit }) {
    let selectedTheme = ref<themeType>(getCurrentTheme())
    const themesData = [
      { txt: '自动', value: 'auto' },
      { txt: '明亮', value: 'light' },
      { txt: '暗黑', value: 'dark' }
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
            header: () => <div>header</div>,
            default: () => (
              <RowItem
                label="主题："
                style={{ textAlign: 'left', width: 'auto' }}
              >
                <n-radio-group v-model:value={selectedTheme.value}>
                  {themesData.map((theme) => (
                    <n-radio key={theme.value} value={theme.value}>
                      {theme.txt}
                    </n-radio>
                  ))}
                </n-radio-group>
              </RowItem>
            )
          }}
        </n-drawer-content>
      </n-drawer>
    )
  }
})
