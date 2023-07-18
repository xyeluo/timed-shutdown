import type { Task, PlanValue } from '@cmn/types'
import { useConvertTaskPlan } from '@cmn/hooks'
import { Actions } from '@notice/components/Actions'

declare global {
  interface Window {
    receiveNotice(task: Task): void
  }
}

const Title = defineComponent({
  props: {
    options: Object as PropType<{ planLabel: PlanValue; duration: number }>
  },
  setup(props) {
    return () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>{props.options!.planLabel}通知</p>
        <p style={{ color: '#61656a' }}>{props.options!.duration}</p>
      </div>
    )
  }
})

export default defineComponent({
  setup() {
    const { info } = useNotification()

    const notify = (parms: Task) => {
      let duration = ref(5)
      const planLabel = useConvertTaskPlan(parms.plan)
      const n = info({
        title: () => (
          <Title options={{ planLabel, duration: duration.value }} />
        ),
        keepAliveOnHover: true,
        closable: false,
        action: () => <Actions task={parms} noticeHandle={n} />
      })
      n.content = () => (
        <p>
          您的电脑预计在5分钟后自动<b>{planLabel}</b>
        </p>
      )
      n.description = `来自uTools定时关机插件: ${parms.name}`
      n.onAfterEnter = () => {
        const timed = setInterval(() => {
          duration.value--
          if (duration.value < 0) {
            clearInterval(timed)
            n.destroy()
            return
          }
        }, 1000)
      }
    }
    /**
     * @example
     */
    // let task: Task = {
    //   name: 'TS_1718-2023-07-13',
    //   plan: 'dormancy',
    //   cycle: {
    //     autoDelete: true,
    //     date: '2023-07-13',
    //     otherDate: [],
    //     type: 'daily',
    //     time: '17:18'
    //   },
    //   skip: false,
    //   state: true,
    //   notice: { cron: '30 32 21 */1 * *', dateTime: '2023-7-13 17:16' }
    // }
    // notify(task)
    window.receiveNotice = (noticeTask) => {
      notify(noticeTask)
    }
  }
})
