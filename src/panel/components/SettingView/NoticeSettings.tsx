import { useSettingsStore } from '@/panel/stores'
import { RowItem } from '@panel/components/common'
import PPanelScss from '@panel/styles/PlanPanel.module.scss'

const AdvanceMinutes = defineComponent({
  setup() {
    const settingsStore = useSettingsStore()
    let loading = ref(false)
    const setAdvanceNotice = (minutes: number) => {
      loading.value = !loading.value
      settingsStore
        .setAdvanceNotice(minutes)
        .then(() => (loading.value = !loading.value))
    }
    return () => (
      <RowItem
        label="时间："
        labelStyle={{ textAlign: 'right', width: '70px' }}
      >
        <div>
          提前&ensp;
          <n-input-number
            style={{ width: '96px', display: 'inline-block' }}
            size="small"
            min="2"
            max="15"
            v-model:value={settingsStore.settings.advanceNotice}
            onUpdateValue={setAdvanceNotice}
            loading={loading.value}
          />
          &ensp;分钟
        </div>
      </RowItem>
    )
  }
})

const TipSound = defineComponent({
  setup() {
    const settingsStore = useSettingsStore()
    return () => (
      <RowItem
        label="提示音："
        labelStyle={{ textAlign: 'right', width: '70px' }}
      >
        <n-switch
          class={PPanelScss.extra}
          default-value={settingsStore.settings.tipSound}
          onUpdateValue={settingsStore.tipSoundSwitch}
        >
          {{
            checked: () => '打开',
            unchecked: () => '关闭'
          }}
        </n-switch>
      </RowItem>
    )
  }
})

export default defineComponent({
  setup() {
    return () => (
      <>
        <RowItem label="通知" labelStyle={{ textAlign: 'left' }} />
        <AdvanceMinutes />
        <TipSound />
      </>
    )
  }
})
