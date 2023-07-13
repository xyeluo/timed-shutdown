import { defineStore } from 'pinia'
import {
  useFirstCycle,
  useFirstType,
  useCompleteDate,
  useCompleteName,
  useNoticeCron
} from '@cmn/hooks'
import type { Task } from '@cmn/types'
import { cloneStore } from '@cmn/utils'
import { usePlansStore } from '@cmn/stores'

export const useTaskStore = defineStore('TaskStore', () => {
  const init: Task = {
    name: '',
    plan: useFirstType(),
    cycle: {
      type: useFirstCycle(),
      date: null,
      time: null,
      otherDate: [],
      autoDelete: true
    },
    state: true,
    notice: {
      cron: '',
      dateTime: ''
    }
  }
  const { addPlan, addTaskDB } = usePlansStore()

  let task = ref<Task>(cloneStore(init))

  // 当任务周期发生改变时清除date
  watch(
    () => task.value.cycle.type,
    () => {
      task.value.cycle.date = null
      task.value.cycle.otherDate = []
    }
  )

  const reset = () => {
    task.value = cloneStore(init)
  }

  const createTask = async () => {
    useCompleteDate(task.value)
    useCompleteName(task.value)

    const stdout = await preload.createTask(cloneStore(task.value))

    task.value.notice = useNoticeCron(cloneStore(task.value.cycle), 5)
    addPlan(cloneStore(task.value))
    addTaskDB(cloneStore(task.value))
    reset()
    return stdout
  }

  return { task, createTask }
})
