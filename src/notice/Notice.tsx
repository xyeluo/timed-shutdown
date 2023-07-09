import { usePlansStore } from '@/common/stores'
import type { PlanValue } from '@/common/types'
import { noticeBeep } from '@/panel/utils'

declare global {
  interface Window {
    receiveNotice(parms: any): void
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
      plan: PlanValue
    }
    const { info } = useNotification()
    const { plans } = usePlansStore()
    const getPlan = (name: string) => plans.find((plan) => plan.name === name)

    const notify = (parms: noticeType) => {
      const n = info({
        title: '关机/休眠/重启通知',
        content: ' 您的电脑将在3分钟后自动关机/休眠/重启',
        description: `uTools定时关机插件:`,
        // duration: 2500,
        keepAliveOnHover: true,
        action: () => <Action />
      })
      n.title = () => <p>{parms.plan}通知</p>
      n.content = () => (
        <p>
          您的电脑将在5分钟后自动<b>{parms.plan}</b>
        </p>
      )
      n.description = `uTools定时关机插件: ${parms.name}`
    }
    window.receiveNotice = (name: string) => {
      const plan = getPlan(name)

      noticeBeep()
      notify({ name: plan!.name, plan: plan!.plan })
    }
  }
})
