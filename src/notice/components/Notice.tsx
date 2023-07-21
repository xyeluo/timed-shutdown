import type { Task, PlanValue } from '@cmn/types'
import { useConvertTaskPlan } from '@cmn/hooks'
import { Actions } from '@notice/components/Actions'
import { changeTheme } from '@/common/Page'

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

    let settings = noticePreload.dbStorageRead('settings')
    changeTheme(settings.currentTheme)
    let noticeArray: string[] = []

    const notify = (parms: Task) => {
      settings.tipSound && utools.shellBeep()

      const planLabel = useConvertTaskPlan(parms.plan)
      noticeArray.push(parms.name)
      const removeNotice = () => {
        noticeArray = noticeArray.filter((name) => parms.name !== name)
      }
      const n = info({
        title: () => <Title planLabel={planLabel} />,
        keepAliveOnHover: true,
        closable: false,
        action: () => (
          <Actions
            task={parms}
            noticeHandle={n}
            onRemoveNotice={removeNotice}
          />
        ),
        description: `来自uTools定时关机插件: ${parms.name}`,
        duration: 60000
      })
      n.content = () => (
        <p>
          您的电脑预计在5分钟后自动<b>{planLabel}</b>
        </p>
      )
      window.noticeError = (err) => {
        const _name = `error:${parms.name}`
        noticeArray.push(_name)
        error({
          title: () => <Title planLabel={useConvertTaskPlan(parms.plan)} />,
          description: `来自uTools定时关机插件: ${parms.name}`,
          content: err,
          onClose() {
            noticeArray = noticeArray.filter((name) => _name !== name)
          }
        })
      }
    }

    // 无通知时关闭窗口
    setInterval(() => {
      console.log(noticeArray)
      if (noticeArray.length !== 0) return
      noticePreload.closeWindow()
    }, 20000)

    window.receiveNotice = (noticeTask) => notify(noticeTask)

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
    // setTimeout(() => {
    //   notify(task)
    // }, 1000)
  }
})
