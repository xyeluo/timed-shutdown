import type { PlanValue, Task } from '@cmn/types'
import { useDateCompute, useConvertTaskPlan } from '@cmn/hooks'
import { cloneStore } from '@cmn/utils'
import type { PropType } from 'vue'

declare global {
  interface Window {
    receiveNotice(task: Task): void
  }
}

const Action = defineComponent({
  props: {
    task: Object as PropType<Task>
  },
  setup(props) {
    const delayTask = () => {
      const { date, time } = useDateCompute(props.task!.cycle, 10, '+')
      const task: Task = {
        name: '',
        plan: props.task!.plan,
        cycle: {
          type: 'once',
          date,
          time,
          otherDate: props.task!.cycle.otherDate,
          autoDelete: true
        },
        state: true
      }
      noticePreload.createTask(cloneStore(task))
    }

    let isStop = true
    const stopState = () => {
      // 当任务暂停后不能再切换状态
      if (!isStop) return
      isStop = false
      noticePreload.stopPlan(cloneStore(props.task) as Task)
    }
    return () => (
      <n-space>
        <n-button size="small" onClick={delayTask}>
          推迟十分钟
        </n-button>
        <n-button size="small" onClick={stopState}>
          暂停执行
        </n-button>
        <n-button size="small">已读</n-button>
      </n-space>
    )
  }
})

export default defineComponent({
  setup() {
    const { info } = useNotification()

    let task = ref<Task>()
    const notify = (parms: { name: string; plan: PlanValue }) => {
      const n = info({
        // duration: 2500,
        keepAliveOnHover: true,
        action: () => <Action task={task.value} />
      })
      n.title = () => <p>{parms.plan}通知</p>
      n.content = () => (
        <p>
          您的电脑预计在5分钟后自动<b>{parms.plan}</b>
        </p>
      )
      n.description = `来自uTools定时关机插件: ${parms.name}`
    }

    window.receiveNotice = (noticeTask) => {
      notify({
        name: noticeTask.name,
        plan: useConvertTaskPlan(noticeTask.plan)
      })
      task.value = noticeTask
    }
  }
})
