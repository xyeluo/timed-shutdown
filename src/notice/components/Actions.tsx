import type { Task } from '@cmn/types'
import { useDateCompute, useNoticeCron } from '@cmn/hooks'
import { cloneStore } from '@cmn/utils'
import type { NotificationReactive } from 'naive-ui'

export const Actions = defineComponent({
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true
    },
    noticeHandle: Object as PropType<NotificationReactive>
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
      props.noticeHandle?.destroy()
    }
    const read = () => props.noticeHandle?.destroy()

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
        <n-button size="small" onClick={() => once(read)}>
          已读
        </n-button>
      </n-space>
    )
  }
})
