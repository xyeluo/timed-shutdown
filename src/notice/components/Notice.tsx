import type { Task, PlanValue } from '@cmn/types'
import { useConvertTaskPlan } from '@cmn/hooks'
import { Actions } from '@notice/components/Actions'
import { changeTheme } from '@cmn/components/Page'
import { useSettings } from '../hooks/settings'

const Title = defineComponent({
  props: {
    options: Object as PropType<{ planLabel: PlanValue; duration?: number }>
  },
  setup(props) {
    return () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>{props.options!.planLabel}通知</p>
        {props.options?.duration ? (
          <p style={{ color: '#61656a' }}>{props.options!.duration}</p>
        ) : null}
      </div>
    )
  }
})

export default defineComponent({
  setup() {
    const { info, error } = useNotification()

    const settings = useSettings()
    changeTheme(settings.currentTheme)
    let noticeArray: string[] = []

    const notify = (parms: Task) => {
      const planLabel = useConvertTaskPlan(parms.plan)

      // 系统通知模式
      if (settings.mode === 'system') {
        utools.showNotification(
          `您的电脑预计在${settings.advanceNotice}分钟后自动${planLabel}`,
          'shutdown'
        )
        return
      }

      let duration = ref(25) //设置通知自动关闭时间，单位s
      settings.tipSound && utools.shellBeep()

      noticeArray.push(parms.name)
      const removeNotice = () => {
        noticeArray = noticeArray.filter((name) => parms.name !== name)
      }
      const n = info({
        title: () => (
          <Title options={{ planLabel, duration: duration.value }} />
        ),
        closable: false,
        action: () => (
          <Actions
            task={parms}
            noticeHandle={n}
            onRemoveNotice={removeNotice}
          />
        ),
        description: `来自uTools定时关机插件: ${parms.name}`
      })
      n.content = () => (
        <p>
          您的电脑预计在{settings.advanceNotice}分钟后自动<b>{planLabel}</b>
        </p>
      )
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

    // 无通知时关闭窗口
    setInterval(() => {
      console.log(noticeArray)
      if (noticeArray.length !== 0) return
      noticePreload.closeWindow()
    }, 10000)

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
