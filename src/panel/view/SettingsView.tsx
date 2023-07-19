import { useSettingsStore } from '@/panel/stores'
import { RowItem, PanelSelect } from '@panel/components/common'
import NoticeMinutes from '@/panel/components/SettingView/NoticeSettings'

const Themes = defineComponent({
  setup() {
    const settingsStore = useSettingsStore()
    const themesData = [
      { label: '自动', value: 'auto' },
      { label: '明亮', value: 'light' },
      { label: '暗黑', value: 'dark' }
    ]

    return () => (
      <>
        <RowItem label="全局" style={{ textAlign: 'left' }} />
        <RowItem label="主题：" style={{ textAlign: 'right', width: '70px' }}>
          <PanelSelect
            options={themesData}
            v-model:value={settingsStore.settings.currentTheme}
            onUpdateValue={settingsStore.changeTheme}
          ></PanelSelect>
        </RowItem>
      </>
    )
  }
})

export default defineComponent({
  props: {
    active: Boolean
  },
  emits: ['update:active'],
  setup(props, { emit }) {
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
              <>
                <Themes />
                <hr style={{ marginTop: '10px' }} />
                <NoticeMinutes />
              </>
            )
          }}
        </n-drawer-content>
      </n-drawer>
    )
  }
})
