import { useSettingsStore } from '@/panel/stores'
import { RowItem } from '@panel/components/common'

export default defineComponent({
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
      <RowItem label="通知时间：" style={{ textAlign: 'right', width: 'auto' }}>
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
