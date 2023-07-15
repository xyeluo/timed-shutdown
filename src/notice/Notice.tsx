import type { Task } from '@cmn/types'
import { useDateCompute, useConvertTaskPlan, useNoticeCron } from '@cmn/hooks'
import { cloneStore } from '@cmn/utils'
import type { PropType } from 'vue'

declare global {
  interface Window {
    receiveNotice(task: Task): void
  }
}

const Action = defineComponent({
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true
    }
  },
  setup(props) {
    const delayTask = () => {
      const { date, time } = useDateCompute(props.task!.cycle, 10, '+')
      const task: Task = {
        ...props.task,
        name: '',
        cycle: {
          type: 'once',
          date,
          time,
          otherDate: props.task!.cycle.otherDate,
          autoDelete: true
        }
      }
      noticePreload.createTask(cloneStore(task))
      skipCurrentPlan()
    }

    const skipCurrentPlan = () => {
      const enableCron = useNoticeCron(
        { ...props.task!.cycle, type: 'once' },
        1,
        '+'
      )
      noticePreload.stopPlan(
        cloneStore({ ...props.task, skip: true, notice: enableCron }) as Task
      )
    }

    let clickState = ref(true)
    const once = (callback: Function) => {
      // 推迟和暂停只能点击一次
      if (!clickState) return
      callback()
      clickState.value = false
    }
    return () => (
      <n-space>
        <n-button
          size="small"
          onClick={() => once(delayTask)}
          disabled={!clickState.value}
        >
          推迟十分钟
        </n-button>
        <n-button
          size="small"
          onClick={() => once(skipCurrentPlan)}
          disabled={!clickState.value}
        >
          暂停本次执行
        </n-button>
        <n-button size="small">已读</n-button>
      </n-space>
    )
  }
})

export default defineComponent({
  setup() {
    const { info } = useNotification()

    const notify = (parms: Task) => {
      const planLabel = useConvertTaskPlan(parms.plan)
      const n = info({
        // duration: 2500,
        keepAliveOnHover: true,
        action: () => <Action task={parms} />
      })
      n.title = () => <p>{planLabel}通知</p>
      n.content = () => (
        <p>
          您的电脑预计在5分钟后自动<b>{planLabel}</b>
        </p>
      )
      n.description = `来自uTools定时关机插件: ${parms.name}`
    }

    window.receiveNotice = (noticeTask) => {
      notify(noticeTask)
    }
  }
})
