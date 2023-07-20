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
  emits: ['removeNotice'],
  setup(props, { emit }) {
    let delayBtnLoading = ref(false)
    let skipBtnLoading = ref(false)
    const delayTask = async () => {
      const { date, time } = useDateCompute(props.task!.cycle, 10, '+')
      const task: Task = {
        ...props.task,
        name: `推迟${props.task.name}`,
        cycle: {
          type: 'once',
          date,
          time,
          otherDate: props.task!.cycle.otherDate,
          autoDelete: true
        }
      }
      await skipCurrentPlan(false)
      return noticePreload
        .createTask(cloneStore(task))
        .then(() => (delayBtnLoading.value = !delayBtnLoading.value))
    }

    const skipCurrentPlan = async (flag: boolean = true) => {
      // skipCurrentPlan的loading状态，点击推迟按钮时不会触发该状态改变
      flag && (skipBtnLoading.value = !skipBtnLoading.value)
      const enableCron = useNoticeCron(
        { ...props.task!.cycle, type: 'once' },
        1,
        '+'
      )

      noticePreload
        .stopPlan(
          cloneStore({ ...props.task, skip: true, notice: enableCron }) as Task
        )
        .then(() => flag && (skipBtnLoading.value = !skipBtnLoading.value))
    }
    const read = () => {
      emit('removeNotice')
      props.noticeHandle?.destroy()
    }

    let clickState = ref(true)
    const once = (callback: () => Promise<any>) => {
      // 推迟和暂停只能点击一次
      if (!clickState) return
      callback().finally(() => {
        emit('removeNotice')
        clickState.value = false
        props.noticeHandle?.destroy()
      })
    }
    return () => (
      <n-space>
        <n-button
          size="small"
          onClick={() => once(delayTask)}
          disabled={!clickState.value}
          loading={delayBtnLoading.value}
        >
          推迟十分钟
        </n-button>
        <n-button
          size="small"
          onClick={() => once(skipCurrentPlan)}
          disabled={!clickState.value}
          loading={skipBtnLoading.value}
        >
          暂停本次执行
        </n-button>
        <n-button size="small" onClick={read}>
          已读
        </n-button>
      </n-space>
    )
  }
})
