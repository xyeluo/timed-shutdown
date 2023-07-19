import type { Task, PlanValue } from '@cmn/types'
import { useConvertTaskPlan } from '@cmn/hooks'
import { Actions } from '@notice/components/Actions'

declare global {
  interface Window {
    receiveNotice(task: Task): void
    noticeError(error: string): void
  }
}

const Title = defineComponent({
  props: {
    planLabel: Object as PropType<PlanValue>
  },
  setup(props) {
    return () => <p>{props.planLabel}通知</p>
  }
})

export default defineComponent({
  setup() {
    const { info, error } = useNotification()

    const notify = (parms: Task) => {
      const planLabel = useConvertTaskPlan(parms.plan)
      const n = info({
        title: () => <Title planLabel={planLabel} />,
        keepAliveOnHover: true,
        closable: false,
        action: () => <Actions task={parms} noticeHandle={n} />,
        description: `来自uTools定时关机插件: ${parms.name}`,
        duration: 100000
      })
      n.content = () => (
        <p>
          您的电脑预计在5分钟后自动<b>{planLabel}</b>
        </p>
      )
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

      window.noticeError = (err) => {
        error({
          title: () => (
            <Title planLabel={useConvertTaskPlan(noticeTask.plan)} />
          ),
          description: `来自uTools定时关机插件: ${noticeTask.name}`,
          content: err
        })
      }
    }
  }
})
