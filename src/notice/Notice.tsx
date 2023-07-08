declare global {
  interface Window {
    setNotice(parms: any): void
  }
}

const Action = defineComponent({
  setup() {
    return () => (
      <n-space>
        <n-button size="small">推迟十分钟</n-button>
        <n-button size="small">暂停本次执行</n-button>
        <n-button size="small">已读</n-button>
      </n-space>
    )
  }
})

export default defineComponent({
  setup() {
    interface noticeType {
      name: string
    }
    const { info } = useNotification()
    const notify = (parms: noticeType) => {
      const n = info({
        title: '关机/休眠/重启通知',
        content: ' 您的电脑将在3分钟后自动关机/休眠/重启',
        description: `uTools定时关机插件：TS_0200-2023-07-20`,
        // duration: 2500,
        keepAliveOnHover: true,
        action: () => <Action />
      })
      n.title = () => <p>{parms.name}</p>
      n.content = () => (
        <p>
          您的电脑将在3分钟后自动<b>{parms.name}</b>
        </p>
      )
    }
    notify({ name: 'teset1' })
    // window.setNotice = (parms) => {

    //   // noticeList.value.push(parms)
    // }
  }
})
