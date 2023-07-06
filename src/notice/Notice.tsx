export default defineComponent({
  setup() {
    const { info } = useNotification()

    const notify = () => {
      const n = info({
        title: () => <p>关机通知</p>,
        content: () => (
          <p>
            您的电脑将在3分钟后自动<b>关机</b>
          </p>
        ),
        meta: () => <p></p>,
        description: `uTools定时关机插件：TS_0200-2023-07-20`,
        // duration: 2500,
        keepAliveOnHover: true,
        action: () => (
          <n-space>
            <n-button size="small">推迟十分钟</n-button>
            <n-button size="small">暂停本次执行</n-button>
            <n-button size="small">已读</n-button>
          </n-space>
        )
      })
    }
    onMounted(() => {
      notify()
    })
  }
})
